from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum

# Enums
class PriorityEnum(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"

# Base schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr

class TaskBase(BaseModel):
    title: str
    
class SubTaskBase(BaseModel):
    title: str

# Request schemas
class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

class TaskCreate(TaskBase):
    notes: Optional[str] = None
    date: str  # YYYY-MM-DD format
    start_time: Optional[str] = None  # HH:MM format
    end_time: Optional[str] = None  # HH:MM format
    color: Optional[str] = None
    icon: Optional[str] = None
    is_all_day: Optional[bool] = False
    is_anytime: Optional[bool] = False
    repeat: Optional[str] = None
    completed: Optional[bool] = False
    category: Optional[str] = None
    priority: Optional[PriorityEnum] = PriorityEnum.medium
    due_date: Optional[str] = None  # YYYY-MM-DD format

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    notes: Optional[str] = None
    date: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    color: Optional[str] = None
    icon: Optional[str] = None
    is_all_day: Optional[bool] = None
    is_anytime: Optional[bool] = None
    repeat: Optional[str] = None
    completed: Optional[bool] = None
    category: Optional[str] = None
    priority: Optional[PriorityEnum] = None
    progress: Optional[int] = None
    due_date: Optional[str] = None

class SubTaskCreate(SubTaskBase):
    completed: Optional[bool] = False

class SubTaskUpdate(BaseModel):
    title: Optional[str] = None
    completed: Optional[bool] = None

class GenerateSubtasksRequest(BaseModel):
    num_subtasks: Optional[int] = 5

# Response schemas
class UserSettings(BaseModel):
    theme: str
    notifications_enabled: bool
    default_view: str
    first_day_of_week: str
    date_format: str
    language: str
    
    class Config:
        from_attributes = True

class UserResponse(UserBase):
    id: int
    created_at: datetime
    settings: Optional[UserSettings] = None
    
    class Config:
        from_attributes = True

class User(UserBase):
    id: int
    created_at: datetime
    settings: Optional[UserSettings] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    user: UserResponse

class TokenRefresh(BaseModel):
    access_token: str
    token_type: str
    
class TokenData(BaseModel):
    user_id: Optional[int] = None

class SubTask(SubTaskBase):
    id: int
    completed: bool
    task_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class Task(TaskBase):
    id: int
    notes: Optional[str] = None
    date: str
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    color: Optional[str] = None
    icon: Optional[str] = None
    is_all_day: bool
    is_anytime: bool
    repeat: Optional[str] = None
    completed: bool
    category: Optional[str] = None
    priority: PriorityEnum
    progress: Optional[int] = None
    due_date: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    user_id: int
    subtasks: List[SubTask] = []
    
    class Config:
        from_attributes = True

class TaskDelete(BaseModel):
    id: int
    message: str = "Task deleted successfully"

class SubTaskDelete(BaseModel):
    id: int
    message: str = "Subtask deleted successfully"

