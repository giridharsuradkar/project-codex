# College Classroom Management Web Application

This project is a beginner-friendly full-stack classroom management system for a college. It includes a Node.js backend, a MySQL database schema, and a clean HTML/CSS/JavaScript frontend for admin, faculty, and student users.

## Project Structure

```text
D:\project codex
|-- backend
|   |-- package.json
|   |-- .env.example
|   |-- sql
|   |   `-- schema.sql
|   `-- src
|       |-- app.js
|       |-- server.js
|       |-- config
|       |   `-- db.js
|       |-- controllers
|       |-- middlewares
|       |-- models
|       |-- routes
|       |-- services
|       `-- utils
|-- frontend
|   |-- index.html
|   |-- css
|   |   `-- styles.css
|   `-- js
|       `-- app.js
`-- README.md
```

## Database Design

Core tables:

- `users`
- `departments`
- `classes`
- `classrooms`
- `allocations`

Support tables used for timetable and request flows:

- `class_schedules`
- `classroom_requests`

Schema file:

- [schema.sql](D:\project codex\backend\sql\schema.sql)

Demo login credentials seeded by the schema:

- Admin: `admin@college.com`
- Faculty: `faculty@college.com`
- Student: `student@college.com`
- Password for all demo users: `Password@123`

## Backend API

Base URL:

```text
http://localhost:5000/api
```

Authentication:

- `POST /auth/login`
- `GET /auth/profile`

Admin APIs:

- `GET/POST/PUT/DELETE /departments`
- `GET/POST/PUT/DELETE /classes`
- `GET/POST/PUT/DELETE /classrooms`
- `GET/POST/PUT/DELETE /allocations`

Faculty APIs:

- `GET /faculty/classes`
- `GET /faculty/allocations`
- `GET /faculty/classrooms/availability`
- `POST /faculty/requests`
- `GET /faculty/requests`

Student APIs:

- `GET /student/schedule`

## Setup Instructions

### 1. Install prerequisites

Install these on your machine:

1. Node.js 18 or later
2. MySQL 8 or later
3. A browser
4. A static file server such as VS Code Live Server

### 2. Configure the database

1. Open MySQL.
2. Run [schema.sql](D:\project codex\backend\sql\schema.sql).
3. This creates the `college_classroom_management` database with demo records.

### 3. Configure the backend

1. Open a terminal in [backend](D:\project codex\backend).
2. Install packages:

```bash
npm install
```

3. Create a `.env` file using [backend/.env.example](D:\project codex\backend\.env.example).
4. Update the database credentials and `JWT_SECRET`.
5. Start the API server:

```bash
npm run dev
```

The backend will run on `http://localhost:5000`.

### 4. Run the frontend

1. Open [frontend/index.html](D:\project codex\frontend\index.html) with a static server.
2. Make sure the backend is already running.
3. Login with one of the demo accounts.

## Integration Flow

1. The frontend sends `fetch` requests to the Express backend.
2. The backend validates JWT tokens and role access through middleware.
3. Controllers call model functions that execute MySQL queries.
4. Allocation data is shown in the dashboard for all roles.
5. Admin users can manage data, faculty users can request room changes, and student users can see schedules.

## Notes

- The backend uses an MVC-style folder structure to keep the code easy to follow.
- Comments and naming are intentionally simple for beginner-friendly learning.
- This environment does not currently have `node`, `npm`, or `git` available in PATH, so I could not run the project here. The code and setup steps are ready for a local machine with Node.js and MySQL installed.
