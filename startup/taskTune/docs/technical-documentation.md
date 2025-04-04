# TaskTune Technical Documentation

## 1. System Overview

TaskTune is a modern task management and productivity application built with a Next.js frontend and FastAPI backend. The application features AI-powered task planning, smart scheduling, and various productivity tools.

### 1.1 Architecture

- **Frontend**: Next.js with TypeScript
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL
- **Authentication**: JWT-based authentication
- **AI Integration**: OpenAI API for smart task planning

## 2. Backend Architecture

### 2.1 Database Models

#### User Model
```python
class User(Base):
    id: Integer (Primary Key)
    name: String
    email: String (Unique)
    hashed_password: String
    created_at: DateTime
    updated_at: DateTime
    tasks: Relationship[Task]
    settings: Relationship[UserSettings]
```

#### Task Model
```python
class Task(Base):
    id: Integer (Primary Key)
    title: String
    notes: Text
    date: String (YYYY-MM-DD)
    start_time: String (HH:MM)
    end_time: String (HH:MM)
    color: String
    icon: String
    is_all_day: Boolean
    is_anytime: Boolean
    repeat: String
    completed: Boolean
    category: String
    priority: Enum[low, medium, high]
    progress: Integer (0-100)
    due_date: String (YYYY-MM-DD)
    user_id: Integer (Foreign Key)
    subtasks: Relationship[SubTask]
```

#### UserSettings Model
```python
class UserSettings(Base):
    id: Integer (Primary Key)
    user_id: Integer (Foreign Key)
    theme: String
    notifications_enabled: Boolean
    default_view: String
    first_day_of_week: String
    date_format: String
    language: String
```

### 2.2 API Endpoints

- `/register` - User registration
- `/login` - User authentication
- `/tasks` - Task CRUD operations
- `/tasks/{task_id}/subtasks` - Subtask management
- `/users/me/settings` - User settings management

## 3. Frontend Architecture

### 3.1 Core Components

#### Task Management
- `task-modal.tsx` - Task creation and editing
- `task-calendar-view.tsx` - Calendar view of tasks
- `task-kanban-view.tsx` - Kanban board view
- `task-timeline.tsx` - Timeline view
- `task-spatial-view.tsx` - Spatial organization view

#### AI Features
- `ai-planner.tsx` - AI-powered task planning
- `ai-smart-scheduler.tsx` - Intelligent task scheduling
- `smart-scheduler.tsx` - Smart scheduling interface

#### Productivity Tools
- `focus-timer.tsx` - Focus session timer
- `energy-tracker.tsx` - Energy level tracking
- `focus-patterns.tsx` - Focus pattern analysis
- `gentle-nudge.tsx` - Productivity reminders

#### Dashboard & Analytics
- `dashboard.tsx` - Main dashboard
- `enhanced-dashboard.tsx` - Advanced dashboard features
- `activity-chart.tsx` - Activity visualization
- `projects-chart.tsx` - Project progress tracking

### 3.2 UI Components
- `theme-provider.tsx` - Theme management
- `time-picker.tsx` - Time selection interface
- `view-switcher.tsx` - View mode switching
- `sidebar.tsx` - Navigation sidebar

## 4. Features

### 4.1 Task Management
- Create, read, update, and delete tasks
- Subtask support
- Priority levels (low, medium, high)
- Task categorization
- Progress tracking
- Due date management
- Recurring tasks

### 4.2 AI Integration
- Smart task planning
- Intelligent scheduling
- Task prioritization
- Productivity suggestions
- Focus pattern analysis

### 4.3 Productivity Tools
- Focus timer
- Energy tracking
- Gentle productivity reminders
- Meeting management
- Quick actions

### 4.4 Views
- Calendar view
- Kanban board
- Timeline view
- Spatial organization
- List view

### 4.5 User Settings
- Theme customization
- Notification preferences
- Default view selection
- Date format preferences
- Language selection

## 5. Development Setup

### 5.1 Prerequisites
- Node.js
- Python 3.8+
- PostgreSQL
- Docker (optional)

### 5.2 Environment Variables
```env
DATABASE_URL=postgresql://postgres:password@db/aashu
SECRET_KEY=your_secret_key
OPENAI_API_KEY=your_openai_api_key
```

### 5.3 Installation

1. Clone the repository
2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
pip install -r requirements.txt
```

4. Start the development servers:
```bash
# Frontend
npm run dev

# Backend
uvicorn main:app --reload
```

### 5.4 Docker Deployment
```bash
docker-compose up --build
```

## 6. Security

- JWT-based authentication
- Password hashing
- CORS configuration
- Environment variable protection
- SQL injection prevention
- XSS protection

## 7. Performance Considerations

- Database indexing
- Caching strategies
- API rate limiting
- Frontend code splitting
- Image optimization
- Lazy loading

## 8. Testing

- Unit tests for backend models
- API endpoint testing
- Frontend component testing
- Integration tests
- E2E testing

## 9. Deployment

### 9.1 Production Setup
- Use production-grade PostgreSQL
- Configure proper CORS settings
- Set up SSL/TLS
- Enable rate limiting
- Configure proper logging

### 9.2 Monitoring
- Error tracking
- Performance monitoring
- User analytics
- Server health checks

## 10. Future Enhancements

- Mobile application
- Offline support
- Advanced AI features
- Team collaboration
- Integration with external services
- Advanced analytics
- Custom workflows
- API rate limiting
- Enhanced security features 