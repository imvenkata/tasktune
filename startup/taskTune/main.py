from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from fastapi.responses import JSONResponse

import models
import schemas
import crud
from database import engine, get_db
from auth import get_current_user
from ai_service import generate_subtasks

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Aashu API", description="Backend API for Aashu productivity app")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add error handling for database connection issues
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    # Log the error
    print(f"Global error: {exc}")
    # Return a friendly error message
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred. Please try again later."},
    )

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to Aashu API"}

# Authentication endpoints
@app.post("/register", response_model=schemas.UserResponse)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    return crud.create_user(db=db, user=user)

@app.post("/login", response_model=schemas.Token)
def login(user_credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    return crud.authenticate_user(db, user_credentials)

# Task endpoints
@app.post("/tasks", response_model=schemas.Task)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    return crud.create_task(db=db, task=task, user_id=current_user.id)

@app.get("/tasks", response_model=List[schemas.Task])
def read_tasks(
    skip: int = 0, 
    limit: int = 100, 
    date: Optional[str] = None,
    completed: Optional[bool] = None,
    db: Session = Depends(get_db), 
    current_user: schemas.User = Depends(get_current_user)
):
    return crud.get_tasks(db, user_id=current_user.id, skip=skip, limit=limit, date=date, completed=completed)

@app.get("/tasks/{task_id}", response_model=schemas.Task)
def read_task(task_id: int, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    task = crud.get_task(db, task_id=task_id)
    if task is None or task.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@app.put("/tasks/{task_id}", response_model=schemas.Task)
def update_task(task_id: int, task: schemas.TaskUpdate, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    db_task = crud.get_task(db, task_id=task_id)
    if db_task is None or db_task.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Task not found")
    return crud.update_task(db=db, task_id=task_id, task=task)

@app.delete("/tasks/{task_id}", response_model=schemas.TaskDelete)
def delete_task(task_id: int, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    db_task = crud.get_task(db, task_id=task_id)
    if db_task is None or db_task.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Task not found")
    return crud.delete_task(db=db, task_id=task_id)

# Subtask endpoints
@app.post("/tasks/{task_id}/subtasks", response_model=schemas.SubTask)
def create_subtask(task_id: int, subtask: schemas.SubTaskCreate, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    db_task = crud.get_task(db, task_id=task_id)
    if db_task is None or db_task.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Task not found")
    return crud.create_subtask(db=db, subtask=subtask, task_id=task_id)

@app.put("/subtasks/{subtask_id}", response_model=schemas.SubTask)
def update_subtask(subtask_id: int, subtask: schemas.SubTaskUpdate, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    db_subtask = crud.get_subtask(db, subtask_id=subtask_id)
    if db_subtask is None or db_subtask.task.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Subtask not found")
    return crud.update_subtask(db=db, subtask_id=subtask_id, subtask=subtask)

@app.delete("/subtasks/{subtask_id}", response_model=schemas.SubTaskDelete)
def delete_subtask(subtask_id: int, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    db_subtask = crud.get_subtask(db, subtask_id=subtask_id)
    if db_subtask is None or db_subtask.task.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Subtask not found")
    return crud.delete_subtask(db=db, subtask_id=subtask_id)

# AI-powered endpoints
@app.post("/tasks/{task_id}/generate-subtasks", response_model=List[schemas.SubTask])
def generate_ai_subtasks(
    task_id: int, 
    request: schemas.GenerateSubtasksRequest, 
    db: Session = Depends(get_db), 
    current_user: schemas.User = Depends(get_current_user)
):
    db_task = crud.get_task(db, task_id=task_id)
    if db_task is None or db_task.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Generate subtasks using OpenAI
    subtasks_content = generate_subtasks(
        task_title=db_task.title,
        task_description=db_task.notes or "",
        category=db_task.category or "Task",
        priority=db_task.priority or "medium"
    )
    
    # Create subtasks in the database
    created_subtasks = []
    for content in subtasks_content:
        subtask_data = schemas.SubTaskCreate(title=content, completed=False)
        created_subtask = crud.create_subtask(db=db, subtask=subtask_data, task_id=task_id)
        created_subtasks.append(created_subtask)
    
    return created_subtasks

# User profile endpoints
@app.get("/me", response_model=schemas.UserResponse)
def get_user_profile(current_user: schemas.User = Depends(get_current_user)):
    return current_user

@app.put("/me", response_model=schemas.UserResponse)
def update_user_profile(user_update: schemas.UserUpdate, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    return crud.update_user(db=db, user_id=current_user.id, user=user_update)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

