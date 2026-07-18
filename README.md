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

---

## Task 2: Contact Management System

A robust, modular REST API developed using **Express.js (Node.js)** and **MongoDB (Mongoose)** to manage personal and professional contacts.

### Key Features
* **Modular Architecture**: Complete separation of concerns into Config, Models, Controllers, Routes, Middleware, and Utility layers.
* **Mongoose Schema & Indexing**: Database-enforced validation, unique indexing, and automated timestamps.
* **Input Validation & Duplicate Prevention**: Custom validators check body data for email and phone patterns, and perform duplicate checks against MongoDB before controllers process the request.
* **Advanced Query Support**:
  * **Search**: Partial, case-insensitive string matching across `name`, `email`, and `phone`.
  * **Sorting**: Sort dynamically by any contact property in `asc` or `desc` order.
  * **Pagination**: Standard limit and page management returning full pagination metadata.
* **Global Error Handler**: Custom error-handling middleware that intercepts Mongoose validation, cast, and duplicate key errors to return meaningful JSON error messages.

---

### Folder Structure

```text
Task 2- Contact Management System/
  ├── src/
  │    ├── config/           # Database Connection
  │    │     └── db.js
  │    ├── models/           # Mongoose Data Models
  │    │     └── contact.js
  │    ├── middleware/       # Custom Middlewares
  │    │     ├── errorHandler.js
  │    │     └── validation.js
  │    ├── controllers/      # Route Controller Logic
  │    │     └── contactsController.js
  │    ├── routes/           # Express Route Definitions
  │    │     └── contacts.js
  │    ├── utils/            # Helper Utilities
  │    │     └── validators.js
  │    └── app.js            # Express app configuration
  ├── package.json
  └── .env                   # Environment variables (DB URI, Port)
```

---

### REST API Endpoints

#### Contacts (`/api/contacts`)
* `POST /api/contacts` - Register a new contact. (Body: `name`, `email`, `phone`, `address`, `company`).
* `GET /api/contacts` - Retrieve a paginated, sorted, and searched list of contacts. (Supports: `page`, `limit`, `search`, `sortBy`, `order`).
* `GET /api/contacts/:id` - Retrieve a contact's profile by ID.
* `PUT /api/contacts/:id` - Update contact profile (with validation and duplicate check).
* `DELETE /api/contacts/:id` - Delete contact by ID.

---

### Local Setup Instructions

1. **Navigate to Task 2 directory**:
   ```bash
   cd "Task 2- Contact Management System"
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Create a `.env` file in the root of the task directory:
   ```text
   PORT=3000
   MONGODB_URI=mongodb://127.0.0.1:27017/contact_manager
   ```
4. **Start the Application**:
   * For production/standard execution:
     ```bash
     npm start
     ```
   * For development (with local MongoDB database service):
     ```bash
     npm run dev
     ```
   * For development (with zero-configuration, in-memory MongoDB):
     ```bash
     npm run dev:mem
     ```

---

## Task 3: To-Do List Backend

A professional-grade, secure REST API developed using **Express.js (Node.js)** and **MongoDB (Mongoose)** to manage task items with user authentication isolation.

### Key Features
* **Modular Architecture**: Clean MVC organization separating database, schemas, routes, controller logic, validations, and documentation.
* **JWT User Authentication**: Features token-based login and registration, password encryption via `bcryptjs`, and strict database query filters enforcing task isolation per user.
* **Comprehensive Task Options**: Full CRUD endpoints with checks validating task inputs (title, priority level, due dates, completion state).
* **Advanced Query Support**:
  * **Search**: Partial, case-insensitive string matching across task title and descriptions.
  * **Filtering**: Filters on completion status, priority level, and categories.
  * **Sorting**: Dynamic ascending/descending sorting based on any task property.
  * **Pagination**: Standard limit and page parameters with JSON response pagination metadata.
* **Global Error Handler**: Catches database validations, duplicate email errors, or malformed payloads, mapping them to standard JSON errors.
* **API Documentation (Swagger UI)**: Renders OpenAPI 3.0 specification documents interactively via Swagger UI at `/api-docs`.

---

### Folder Structure

```text
Task 3- To-Do List Backend/
  ├── src/
  │    ├── config/           # Database Connection Setup
  │    │     └── db.js
  │    ├── models/           # Mongoose Data Models (User, Task)
  │    │     ├── user.js
  │    │     └── task.js
  │    ├── middleware/       # Custom Middlewares (JWT Auth, Validation, Errors)
  │    │     ├── auth.js
  │    │     ├── validation.js
  │    │     └── errorHandler.js
  │    ├── controllers/      # Route Actions
  │    │     ├── authController.js
  │    │     └── tasksController.js
  │    ├── routes/           # Routing Definitions
  │    │     ├── auth.js
  │    │     └── tasks.js
  │    ├── utils/            # Helper Utilities
  │    │     └── validators.js
  │    ├── docs/             # OpenAPI Specification
  │    │     └── swagger.json
  │    └── app.js            # Express config
  ├── package.json
  └── .env                   # Configuration parameters
```

---

### REST API Endpoints

#### 1. Authentication (`/api/auth`)
* `POST /api/auth/register` - Create a new user account. (Body: `email`, `password`).
* `POST /api/auth/login` - Authenticate credentials and return JWT token. (Body: `email`, `password`).

#### 2. Tasks (`/api/tasks`) - *Requires Header: `Authorization: Bearer <token>`*
* `POST /api/tasks` - Create a new task. (Body: `title`, `description`, `completed`, `priority`, `dueDate`, `category`).
* `GET /api/tasks` - Retrieve a paginated, filterable, and searched list of tasks. (Supports: `page`, `limit`, `completed`, `priority`, `category`, `q`, `sortBy`, `order`).
* `GET /api/tasks/:id` - Fetch details of a specific task by ID.
* `PUT /api/tasks/:id` - Update an existing task's attributes. (Body: *updated fields*).
* `DELETE /api/tasks/:id` - Delete a task by ID.

---

### Local Setup Instructions

1. **Navigate to Task 3 directory**:
   ```bash
   cd "Task 3- To-Do List Backend"
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Create a `.env` file in the root of the task directory:
   ```text
   PORT=3000
   MONGODB_URI=mongodb://127.0.0.1:27017/todo_db
   JWT_SECRET=supersecretjwtkeyforauth
   JWT_EXPIRES_IN=7d
   ```
4. **Start the Application**:
   * Standard run (Requires local MongoDB):
     ```bash
     npm start
     ```
   * Development run (Requires local MongoDB):
     ```bash
     npm run dev
     ```
   * Zero-Configuration run (Spins up in-memory MongoDB database server automatically):
     ```bash
     npm run dev:mem
     ```
5. **View API Docs**:
   Navigate to `http://localhost:3000/api-docs` on your browser.

---

## API Testing with REST Client (.http)

Each task directory contains a professional-grade `.http` test client file designed for the VS Code **REST Client** extension. You can send API requests and view responses directly from VS Code without needing Postman.

* **Task 1 (Student Record Management API)**: Exposes [test_api.http](file:///c:/Users/sujal/Desktop/CodSoft/Task%201-%20Student%20Management%20API/test_api.http) covering student registrations, course creations, and enrollment check calls.
* **Task 2 (Contact Management System)**: Exposes [test.http](file:///c:/Users/sujal/Desktop/CodSoft/Task%202-%20Contact%20Management%20System/test.http) covering contact CRUD, validations, filtering, searching, and pagination.
* **Task 3 (To-Do List Backend)**: Exposes [test.http](file:///c:/Users/sujal/Desktop/CodSoft/Task%203-%20To-Do%20List%20Backend/test.http) covering user registration, login, secure task management, searching, sorting, pagination, and user isolation security checks.

### How to use:
1. Install the **REST Client** extension in VS Code.
2. Ensure the corresponding task's API server is running.
3. Open the `.http` file in VS Code and click **"Send Request"** directly above the HTTP definitions. For Task 3, JWT tokens are captured and chained automatically!


