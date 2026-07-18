# To-Do List Backend REST API

A professional-grade, secure, and modular REST API developed using **Node.js**, **Express.js**, and **MongoDB (Mongoose)** with **JWT User Authentication**.

---

## Key Features

- **User Authentication (JWT)**:
  - Secure endpoints with `jsonwebtoken` checks.
  - Hashed passwords stored using `bcryptjs` hooks.
  - Strict database-level isolation ensuring users can only read, update, or delete their own tasks.
- **Mongoose Schema & Indexing**:
  - Fields: `title` (required), `description`, `completed` (boolean), `priority` (`low`/`medium`/`high`), `dueDate` (Date), `category`.
  - Multi-field compound indexing for high-performance sorting and query filters.
- **Input Validation & Sanitization**:
  - Express validation middlewares check for correct request formats, email regex matches, date types, and enum inputs.
- **Advanced Query Features**:
  - **Searching**: Case-insensitive keyword lookup matching `title` and `description` fields simultaneously.
  - **Filtering**: Filters on `completed` (boolean), `priority` (`low`/`medium`/`high`), and `category` (case-insensitive matches).
  - **Sorting**: Dynamic ascending/descending sorting based on any task attribute (e.g. `dueDate`, `createdAt`).
  - **Pagination**: Dynamic page bounds with JSON response metadata including `totalTasks`, `totalPages`, `currentPage`, and `limit`.
- **Central Error Interceptor**: Handles database validation, duplicate keys, formatting errors, and maps them to standard HTTP status codes.
- **Interactive API Documentation (Swagger)**: Exposes a live, interactive UI at `/api-docs` using the OpenAPI 3.0 specification.

---

## Folder Structure

```text
Task 3- To-Do List Backend/
  ├── src/
  │    ├── config/           # Database Connection
  │    │     └── db.js
  │    ├── models/           # Mongoose Data Models
  │    │     ├── user.js
  │    │     └── task.js
  │    ├── middleware/       # Custom Middlewares
  │    │     ├── auth.js           # JWT Authorization
  │    │     ├── errorHandler.js   # Central Error Interceptor
  │    │     └── validation.js     # Body Format Validators
  │    ├── controllers/      # Route Controller Actions
  │    │     ├── authController.js
  │    │     └── tasksController.js
  │    ├── routes/           # Express Route Definitions
  │    │     ├── auth.js
  │    │     └── tasks.js
  │    ├── utils/            # Helper Utilities
  │    │     └── validators.js     # Validation Match Checkers
  │    ├── docs/             # API Documentation Specs
  │    │     └── swagger.json      # OpenAPI 3.0 Document
  │    └── app.js            # Express Application Configuration
  ├── package.json
  ├── .env                   # Configuration File (DB Path, JWT Secret, Port)
  └── .env.example           # Environment Configuration Template
```

---

## Local Setup Instructions

1. **Navigate to the Task 3 folder**:

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
   - For production execution (Requires local MongoDB):
     ```bash
     npm start
     ```
   - For development execution (Requires local MongoDB):
     ```bash
     npm run dev
     ```
   - For zero-configuration in-memory database execution:
     ```bash
     npm run dev:mem
     ```

5. **Interact with the API**:
   Once the server boots up, navigate to the Swagger documentation:
   `http://localhost:3000/api-docs`

---

## Testing the API with REST Client

This project contains a [test.http](file:///c:/Users/sujal/Desktop/CodSoft/Task%203-%20To-Do%20List%20Backend/test.http) file designed for the VS Code **REST Client** extension. You can register, login, execute CRUD operations, filter, sort, and paginate tasks directly from VS Code. 

### Running the HTTP Tests:
1. Install the **REST Client** extension in VS Code.
2. Start the Task 3 API server (either `npm run dev` or `npm run dev:mem`).
3. Open the `test.http` file and click **"Send Request"** directly above the requests. Token variables (e.g., `{{tokenA}}`) and task IDs are captured dynamically!


---

## REST API Endpoints & Usage

### 1. Authentication Endpoints (`/api/auth`)

#### Register User

- **URL**: `POST /api/auth/register`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword123"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "message": "User registered successfully",
    "token": "eyJhbGciOiJIUzI1...",
    "user": {
      "id": "6692bc...",
      "email": "user@example.com"
    }
  }
  ```

#### Login User

- **URL**: `POST /api/auth/login`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword123"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1...",
    "user": {
      "id": "6692bc...",
      "email": "user@example.com"
    }
  }
  ```

---

### 2. Task Endpoints (`/api/tasks`)

_Note: All task routes require a valid authentication token passed in the headers:_
`Authorization: Bearer <your_jwt_token>`

#### Create a Task

- **URL**: `POST /api/tasks`
- **Body**:
  ```json
  {
    "title": "Build Node.js Backend",
    "description": "Complete assignment for Task 3",
    "completed": false,
    "priority": "high",
    "dueDate": "2026-07-20T18:00:00.000Z",
    "category": "Work"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "_id": "6692bef...",
    "title": "Build Node.js Backend",
    "description": "Complete assignment for Task 3",
    "completed": false,
    "priority": "high",
    "dueDate": "2026-07-20T18:00:00.000Z",
    "category": "Work",
    "user": "6692bc...",
    "createdAt": "2026-07-13T00:30:00.000Z",
    "updatedAt": "2026-07-13T00:30:00.000Z"
  }
  ```

#### Retrieve Tasks (with search, filter, sort, and pagination)

- **URL**: `GET /api/tasks`
- **Query Parameters**:
  - `completed`: Filter by completion (e.g. `true` / `false`).
  - `priority`: Filter by priority level (e.g. `low`, `medium`, `high`).
  - `category`: Filter by category (e.g. `Work`, `Personal`).
  - `q` / `search`: Search keywords in task `title` or `description`.
  - `sortBy`: Sort by field (e.g. `dueDate`, `createdAt`).
  - `order`: Sort order (e.g. `asc`, `desc`).
  - `page`: Results page number (default: `1`).
  - `limit`: Results limit per page (default: `10`).
- **Success Response (200 OK)**:
  ```json
  {
    "tasks": [
      {
        "_id": "6692bef...",
        "title": "Build Node.js Backend",
        "description": "Complete assignment for Task 3",
        "completed": false,
        "priority": "high",
        "dueDate": "2026-07-20T18:00:00.000Z",
        "category": "Work",
        "user": "6692bc..."
      }
    ],
    "pagination": {
      "totalTasks": 1,
      "totalPages": 1,
      "currentPage": 1,
      "limit": 10
    }
  }
  ```

#### Retrieve Task by ID

- **URL**: `GET /api/tasks/:id`
- **Success Response (200 OK)**:
  ```json
  {
    "_id": "6692bef...",
    "title": "Build Node.js Backend",
    ...
  }
  ```

#### Update Task by ID

- **URL**: `PUT /api/tasks/:id`
- **Body**: _(fields to update)_
  ```json
  {
    "completed": true
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Task updated successfully",
    "task": {
      "_id": "6692bef...",
      "title": "Build Node.js Backend",
      "completed": true,
      ...
    }
  }
  ```

#### Delete Task by ID

- **URL**: `DELETE /api/tasks/:id`
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Task deleted successfully"
  }
  ```
