# FitLog

WILL UPDATE SOON...

Welcome to FitLog, a full-stack fitness tracking web application for logging workouts and managing fitness goals!

![FitLog Screenshot](images/fitlog-home-screenshot.png)

## Tech Stack

**Frontend:** React, React Router, Bootstrap 5, Vite  
**Backend:** Node.js, Express, PostgreSQL

## Features

- Log workouts with exercise type, date, duration, and notes
- Create and track fitness goals with optional deadlines
- Toggle goal completion status
- Full CRUD operations for workouts and goals
- Responsive design

## Setup

### Prerequisites
- Node.js (v14+)
- PostgreSQL (v12+)

### Installation

1. **Clone the repository**
```bash
   git clone https://github.com/yourusername/fitlog.git
   cd fitlog
```

2. **Install dependencies**
```bash
   cd backend && npm install
   cd ../frontend && npm install
```

3. **Set up database**
   
   Create a PostgreSQL database named `fitlog` and run:
```sql
   CREATE TABLE exercise_types (
       id SERIAL PRIMARY KEY,
       name TEXT NOT NULL
   );

   CREATE TABLE workouts (
       id SERIAL PRIMARY KEY,
       exercise_id INTEGER NOT NULL REFERENCES exercise_types(id),
       date DATE NOT NULL,
       duration INTEGER NOT NULL,
       notes TEXT
   );

   CREATE TABLE goals (
       id SERIAL PRIMARY KEY,
       text TEXT NOT NULL,
       category TEXT,
       deadline DATE,
       completed BOOLEAN DEFAULT FALSE
   );

   INSERT INTO exercise_types (name) VALUES
       ('Calisthenics'), ('Climbing'), ('CrossFit'), ('Cycling'), 
       ('HIIT'), ('Hiking'), ('Pilates'), ('Running'), 
       ('Sports'), ('Swimming'), ('Walking'), ('Weightlifting'), ('Yoga');
```

4. **Configure environment variables**
   
   Create `.env` in the backend directory:
```
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_NAME=fitlog
   DB_PORT=5432
```

5. **Run the application**
```bash
   # Terminal 1 - Backend
   cd backend
   node index.js

   # Terminal 2 - Frontend
   cd frontend
   npm start
```

   Backend: `http://localhost:3000`  
   Frontend: `http://localhost:5173`

## API Endpoints

| GET | `/api/exercises` | Get all exercise types |
| GET | `/api/workouts` | Get all workouts |
| POST | `/api/workouts` | Create a workout |
| DELETE | `/api/workouts/:id` | Delete a workout |
| GET | `/api/goals` | Get all goals |
| POST | `/api/goals` | Create a goal |
| PUT | `/api/goals/:id/toggle` | Toggle goal completion |
| DELETE | `/api/goals/:id` | Delete a goal |

