# CodSoft Internship Tasks

This repository contains backend development projects completed as part of the CodSoft Internship.

---

## Task 1: Student Record Management API

A robust, modular REST API developed using **Express.js (Node.js)** and **SQLite** to manage student profiles, course catalogs, and student enrollments.

### Key Features
* **Modular Architecture**: Complete separation of concerns into Config, Controllers, Routes, Middleware, and Utility layers.
* **Relational Database Design**:
  * SQLite database with **Foreign Keys enabled** (`PRAGMA foreign_keys = ON;`).
  * Relational tables for `Students`, `Courses`, and `Enrollments` (junction table).
  * **Cascade Deletes**: Removing a student or course automatically clears their enrollment records, preventing orphaned database entries.
  * **Composite Unique Constraints**: Prevents duplicate course enrollments (a student cannot enroll in the same course twice).
* **Robust Input Validation Middleware**: Custom validators check request bodies, validating email patterns, date formats (`YYYY-MM-DD`), positive credits, and grade values.
* **Advanced Query Support**:
  * **Search**: Search students and courses by name/code (SQL `LIKE` pattern matching).
  * **Filter**: Filter students by exact email.
  * **Sorting**: Sort responses dynamically by specifying `sortBy` (column) and `order` (`ASC` or `DESC`).
  * **Pagination**: Limit and page parameters with standard pagination metadata in responses.
* **Global Error Handler**: Custom error-handling middleware that logs issues and returns proper JSON error payloads with `500` status codes.

---

### Folder Structure

```text
Task 1- Student Management API/
  ├── src/
  │    ├── config/           # Database Connection & Initialization
  │    │     └── database.js
  │    ├── middleware/       # Custom Request Middlewares
  │    │     ├── errorHandler.js   # Global error handling
  │    │     └── validation.js     # Express validation middleware
  │    ├── controllers/      # Route Controller Logic
  │    │     ├── studentsController.js
  │    │     ├── coursesController.js
  │    │     └── enrollmentsController.js
  │    ├── routes/           # Express Route Definitions
  │    │     ├── students.js
  │    │     ├── courses.js
  │    │     └── enrollments.js
  │    ├── utils/            # Helper Utilities
  │    │     ├── dbHelpers.js      # Promisified sqlite3 query wrappers
  │    │     └── validators.js     # Validation format checkers
  │    ├── app.js            # Express app configuration
  │    └── server.js         # Server entry point
  ├── package.json
  └── .env                   # Environment variables (DB path, Port)
```

---

### REST API Endpoints

#### 1. Students (`/api/students`)
* `POST /api/students` - Register a new student. (Body: `first_name`, `last_name`, `email`, `date_of_birth`).
* `GET /api/students` - Retrieve a paginated, sorted, and filtered list of students. (Supports: `page`, `limit`, `search`, `email`, `sortBy`, `order`).
* `GET /api/students/:id` - Retrieve a student's profile by ID.
* `PUT /api/students/:id` - Update student profile.
* `DELETE /api/students/:id` - Delete student (cascades and drops all enrollments).
* `GET /api/students/:id/courses` - List all courses a specific student is enrolled in.

#### 2. Courses (`/api/courses`)
* `POST /api/courses` - Create a new course. (Body: `course_code`, `title`, `credits`, `description`).
* `GET /api/courses` - Retrieve a paginated list of courses. (Supports: `page`, `limit`, `search`, `sortBy`, `order`).
* `GET /api/courses/:id` - Retrieve a course by ID.
* `PUT /api/courses/:id` - Update course details.
* `DELETE /api/courses/:id` - Delete course (cascades and drops all student enrollments).
* `GET /api/courses/:id/students` - List all students enrolled in a specific course.

#### 3. Enrollments (`/api/enrollments`)
* `POST /api/enrollments` - Enroll a student in a course. (Body: `student_id`, `course_id`).
* `GET /api/enrollments` - List all system enrollments with populated student names and course titles.
* `PUT /api/enrollments/:id` - Update enrollment grade. (Body: `grade` - max 2 chars, e.g. `A+`).
* `DELETE /api/enrollments/:id` - Unenroll a student from a course.

---

### Local Setup Instructions

1. **Navigate to Task 1 directory**:
   ```bash
   cd "Task 1- Student Management API"
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Create a `.env` file in the root of the task directory:
   ```text
   PORT=3000
   DB_PATH=./src/database.sqlite
   ```
4. **Start the Application**:
   * For production/standard execution:
     ```bash
     npm start
     ```
   * For development (with auto-restart on changes):
     ```bash
     npm run dev
     ```
