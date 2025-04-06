# TaskTune

TaskTune is a productivity application designed to help users efficiently manage tasks, track progress, and boost productivity through AI-powered features.

## Features

- Task management with various views (Calendar, Kanban, etc.)
- Subtask creation and tracking
- AI-powered task breakdown and planning
- Progress tracking and analytics
- User authentication and personalization

## Recent Bug Fixes

We've recently addressed several bugs and improved the application:

1. Database Connection: Switched to SQLite for development to simplify setup
2. Security Improvements: Removed exposed API keys and improved environment configuration
3. Updated ORM Configuration: Fixed Pydantic V2 compatibility issues
4. Task Store Implementation: Improved API integration in the frontend
5. Date Handling: Enhanced date parsing for better calendar functionality
6. Error Handling: Improved error handling in API calls
7. Subtask Management: Fixed issues with task completion status synchronization
8. AI Features: Implemented robust error handling and fallbacks for AI-powered features
9. Docker Configuration: Fixed OpenAI client compatibility and improved container setup

## Setup and Installation

### Prerequisites

- Node.js 14+
- Python 3.8+
- npm or yarn

### Option 1: Manual Setup

1. Clone the repository
2. Install frontend dependencies:
   ```
   npm install
   ```
3. Install backend dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Copy `.env.example` to `.env` and configure your environment variables
5. Start the backend server:
   ```
   python main.py
   ```
6. Start the frontend development server:
   ```
   npm run dev
   ```

### Option 2: Docker Setup (Recommended)

The easiest way to get started is with Docker:

1. Clone the repository
2. Run the setup script:
   ```
   ./docker-setup.sh
   ```
3. Follow the on-screen instructions to:
   - Create a `.env` file with your API keys
   - Choose between development and production mode

Once running, you can access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## Technologies Used

- Frontend:
  - Next.js and React
  - Tailwind CSS
  - Zustand for state management
  - Shadcn UI components
  
- Backend:
  - FastAPI
  - SQLAlchemy
  - Pydantic
  - SQLite/PostgreSQL

- AI Features:
  - OpenAI GPT models

## Contributing

See our [BUGS_TODO.md](./BUGS_TODO.md) file for a list of issues we're tracking and their status.

## License

MIT

