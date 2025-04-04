from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from database import Base

class PriorityEnum(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    tasks = relationship("Task", back_populates="user", cascade="all, delete-orphan")
    settings = relationship("UserSettings", back_populates="user", uselist=False, cascade="all, delete-orphan")

class UserSettings(Base):
    __tablename__ = "user_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    theme = Column(String, default="light")
    notifications_enabled = Column(Boolean, default=True)
    default_view = Column(String, default="calendar")
    first_day_of_week = Column(String, default="monday")
    date_format = Column(String, default="24-hour")
    language = Column(String, default="en-US")
    
    user = relationship("User", back_populates="settings")

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    notes = Column(Text)
    date = Column(String, nullable=False)  # YYYY-MM-DD format
    start_time = Column(String)  # HH:MM format
    end_time = Column(String)  # HH:MM format
    color = Column(String)
    icon = Column(String)
    is_all_day = Column(Boolean, default=False)
    is_anytime = Column(Boolean, default=False)
    repeat = Column(String)
    completed = Column(Boolean, default=False)
    category = Column(String)
    priority = Column(Enum(PriorityEnum), default=PriorityEnum.medium)
    progress = Column(Integer, default=0)  # 0-100
    due_date = Column(String)  # YYYY-MM-DD format
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    user_id = Column(Integer, ForeignKey("users.id"))
    
    user = relationship("User", back_populates="tasks")
    subtasks = relationship("SubTask", back_populates="task", cascade="all, delete-orphan")

class SubTask(Base):
    __tablename__ = "subtasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    completed = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    task_id = Column(Integer, ForeignKey("tasks.id"))
    
    task = relationship("Task", back_populates="subtasks")

