from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List, Optional
import models
import schemas
from auth import get_password_hash, verify_password, create_access_token, create_refresh_token
from datetime import timedelta

# User operations
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        name=user.name,
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create default user settings
    db_settings = models.UserSettings(user_id=db_user.id)
    db.add(db_settings)
    db.commit()
    db.refresh(db_user)
    
    return db_user

def update_user(db: Session, user_id: int, user: schemas.UserUpdate):
    db_user = get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_data = user.dict(exclude_unset=True)
    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
    
    for key, value in update_data.items():
        setattr(db_user, key, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, user_credentials: schemas.UserLogin):
    user = get_user_by_email(db, email=user_credentials.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    if not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Create access token
    access_token = create_access_token(
        data={"user_id": user.id}
    )
    
    # Create refresh token
    refresh_token = create_refresh_token(
        data={"user_id": user.id}
    )
    
    # Create the UserResponse object from the SQLAlchemy user model
    user_response = schemas.UserResponse.model_validate(user, from_attributes=True)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": user_response # Return the Pydantic model instance
    }

# Task operations
def get_task(db: Session, task_id: int):
    return db.query(models.Task).filter(models.Task.id == task_id).first()

def get_tasks(
    db: Session, 
    user_id: int, 
    skip: int = 0, 
    limit: int = 100, 
    date: Optional[str] = None,
    completed: Optional[bool] = None
):
    query = db.query(models.Task).filter(models.Task.user_id == user_id)
    
    if date:
        query = query.filter(models.Task.date == date)
    
    if completed is not None:
        query = query.filter(models.Task.completed == completed)
    
    return query.offset(skip).limit(limit).all()

def create_task(db: Session, task: schemas.TaskCreate, user_id: int):
    db_task = models.Task(**task.dict(), user_id=user_id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def update_task(db: Session, task_id: int, task: schemas.TaskUpdate):
    db_task = get_task(db, task_id)
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    update_data = task.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_task, key, value)
    
    # Update progress based on subtasks if not explicitly set
    if "progress" not in update_data and db_task.subtasks:
        completed_subtasks = sum(1 for subtask in db_task.subtasks if subtask.completed)
        total_subtasks = len(db_task.subtasks)
        if total_subtasks > 0:
            db_task.progress = int((completed_subtasks / total_subtasks) * 100)
    
    db.commit()
    db.refresh(db_task)
    return db_task

def delete_task(db: Session, task_id: int):
    db_task = get_task(db, task_id)
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db.delete(db_task)
    db.commit()
    return {"id": task_id, "message": "Task deleted successfully"}

# Subtask operations
def get_subtask(db: Session, subtask_id: int):
    return db.query(models.SubTask).filter(models.SubTask.id == subtask_id).first()

def create_subtask(db: Session, subtask: schemas.SubTaskCreate, task_id: int):
    db_subtask = models.SubTask(**subtask.dict(), task_id=task_id)
    db.add(db_subtask)
    db.commit()
    db.refresh(db_subtask)
    
    # Update task progress
    task = get_task(db, task_id)
    if task and task.subtasks:
        completed_subtasks = sum(1 for subtask in task.subtasks if subtask.completed)
        total_subtasks = len(task.subtasks)
        task.progress = int((completed_subtasks / total_subtasks) * 100)
        db.commit()
    
    return db_subtask

def update_subtask(db: Session, subtask_id: int, subtask: schemas.SubTaskUpdate):
    db_subtask = get_subtask(db, subtask_id)
    if not db_subtask:
        raise HTTPException(status_code=404, detail="Subtask not found")
    
    update_data = subtask.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_subtask, key, value)
    
    db.commit()
    db.refresh(db_subtask)
    
    # Update task progress
    task = db_subtask.task
    if task and task.subtasks:
        completed_subtasks = sum(1 for subtask in task.subtasks if subtask.completed)
        total_subtasks = len(task.subtasks)
        task.progress = int((completed_subtasks / total_subtasks) * 100)
        # If all subtasks are completed, mark the task as completed
        if completed_subtasks == total_subtasks and total_subtasks > 0:
            task.completed = True
        # If not all subtasks are completed but task is marked as completed, unmark it
        elif completed_subtasks < total_subtasks and task.completed:
            task.completed = False
        db.commit()
    
    return db_subtask

def delete_subtask(db: Session, subtask_id: int):
    db_subtask = get_subtask(db, subtask_id)
    if not db_subtask:
        raise HTTPException(status_code=404, detail="Subtask not found")
    
    task_id = db_subtask.task_id
    db.delete(db_subtask)
    db.commit()
    
    # Update task progress
    task = get_task(db, task_id)
    if task and task.subtasks:
        completed_subtasks = sum(1 for subtask in task.subtasks if subtask.completed)
        total_subtasks = len(task.subtasks)
        if total_subtasks > 0:
            task.progress = int((completed_subtasks / total_subtasks) * 100)
        else:
            task.progress = 0
        db.commit()
    
    return {"id": subtask_id, "message": "Subtask deleted successfully"}

