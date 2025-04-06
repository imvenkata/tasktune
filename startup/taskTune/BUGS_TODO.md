# TaskTune Project Bugs & Issues

## Database & Backend
1. Database Connection Error - PostgreSQL connection failing, needs proper setup
2. OpenAI API Key Security Issue - Exposed API key in .env file
3. ORM Configuration Warning - Pydantic V2 uses 'from_attributes' instead of 'orm_mode'
4. Authentication Security - Token-based approach needs refresh tokens and better expiration handling
5. Docker Configuration Issue - OpenAI client compatibility issue in container

## Frontend Implementation
6. Task Store Implementation Issue - Zustand store using hardcoded tasks not syncing with backend
7. Date Handling Issues - `parseTaskDate` function has potential issues with date parsing
8. Calendar Rendering Logic - Complex rendering logic could cause UI bugs when switching months
9. Task Dragging Implementation - DnD implementation needs more robust error handling
10. Subtask Management Logic - Completion status sync has edge cases
11. Error Handling in API Calls - Inconsistent error handling in API calls
12. UI Responsiveness Issues - Calendar and task views may not be fully responsive
13. AI-Powered Feature Fragility - AI subtask generation relies on API that could fail silently

## Fix Status
- [x] 1. Database Connection Error - Fixed by switching to SQLite for development
- [x] 2. OpenAI API Key Security Issue - Fixed by removing exposed API key from .env
- [x] 3. ORM Configuration Warning - Fixed by updating 'orm_mode' to 'from_attributes'
- [x] 4. Authentication Security - Fixed by implementing refresh tokens and better expiration handling
- [x] 5. Docker Configuration Issue - Fixed OpenAI client compatibility, improved Dockerfile, and added frontend service
- [x] 6. Task Store Implementation Issue - Fixed by implementing proper API integration
- [x] 7. Date Handling Issues - Fixed by improving date parsing functions
- [x] 8. Calendar Rendering Logic - Fixed by implementing robust date comparison and formatting methods
- [x] 9. Task Dragging Implementation - Fixed by adding comprehensive error handling to drag and drop operations
- [x] 10. Subtask Management Logic - Fixed by improving handling of task completion status
- [x] 11. Error Handling in API Calls - Fixed by improving error handling in API calls
- [x] 12. UI Responsiveness Issues - Fixed by adding responsive design for various screen sizes
- [x] 13. AI-Powered Feature Fragility - Fixed by implementing robust error handling and fallbacks 