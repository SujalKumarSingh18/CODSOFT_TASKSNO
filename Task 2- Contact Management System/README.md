# Contact Management System API

A modular, scalable, and professional REST API developed using **Express.js (Node.js)** and **MongoDB (Mongoose)** to safely manage personal and professional contacts.

---

## Key Features

* **Modular Directory Structure**: Separates database configuration, data models, routes, controllers, utilities, and validation middleware.
* **Mongoose Schema & Indexing**:
  * Fields: `name`, `email` (unique), `phone` (unique), `address`, `company`.
  * Proper indexing for performance and unique validation.
  * Schema-level and custom middleware-level validations.
* **Input Validation & Duplicate Prevention**:
  * Clean formatting regex for email and telephone inputs.
  * Custom validation middleware checking for duplicates *before* hitting database queries to return descriptive and friendly `400 Bad Request` API errors.
* **Advanced Query Support**:
  * **Search**: Partial, case-insensitive string matching across `name`, `email`, and `phone` fields simultaneously.
  * **Sorting**: Dynamic ascending/descending sorting based on any contact attribute (e.g. `name`, `company`, etc.).
  * **Pagination**: Pagination query parameters (`page` and `limit`) returning standardized metadata inside the response body.
* **Global Error Handler**: Custom central error middleware parsing MongoDB errors (e.g. unique constraint 11000) and returning appropriate HTTP responses.

---

## Folder Structure

```text
Task 2- Contact Management System/
  ├── src/
  │    ├── config/           # Database Connection Configuration
  │    │     └── db.js
  │    ├── models/           # Mongoose Data Models
  │    │     └── contact.js
  │    ├── middleware/       # Custom Middlewares (Errors & Validation)
  │    │     ├── errorHandler.js
  │    │     └── validation.js
  │    ├── controllers/      # Router Action Handlers
  │    │     └── contactsController.js
  │    ├── routes/           # REST Route Definitions
  │    │     └── contacts.js
  │    ├── utils/            # Shared Validation Helpers
  │    │     └── validators.js
  │    └── app.js            # Express App Configuration
  ├── package.json
  ├── .gitignore
  └── .env                   # Environment Variables Configuration
```

---

## Local Setup & Installation

### 1. Install Dependencies
Navigate to this directory and install the packages:
```bash
cd "Task 2- Contact Management System"
npm install
```

### 2. Configure Environment Variables
Create a file named `.env` in the root of the project directory and fill it with your settings:
```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/contact_manager
```

### 3. Run the Application
* **Development (Auto-Restart on changes)**:
  ```bash
  npm run dev
  ```
* **Production**:
  ```bash
  npm start
  ```

---

## REST API Endpoints

### 1. Create a Contact
* **Endpoint**: `POST /api/contacts`
* **Headers**: `Content-Type: application/json`
* **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+1987654321",
    "address": "456 Oak Avenue",
    "company": "Tech Corp"
  }
  ```
* **Success Response (201 Created)**:
  ```json
  {
    "_id": "64b0f9f3c1d9b3d0a2f4a56a",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+1987654321",
    "address": "456 Oak Avenue",
    "company": "Tech Corp",
    "createdAt": "2026-07-12T18:53:01.000Z",
    "updatedAt": "2026-07-12T18:53:01.000Z",
    "__v": 0
  }
  ```
* **Error Response (400 Bad Request - Duplicate or Invalid Input)**:
  ```json
  {
    "error": "A contact with email 'jane@example.com' already exists."
  }
  ```

### 2. Get All Contacts (with Search, Sort, Pagination)
* **Endpoint**: `GET /api/contacts`
* **Query Parameters**:
  * `search`: Matches name, email, or phone.
  * `sortBy`: Field to sort by (default: `name`).
  * `order`: Sort order, `asc` or `desc` (default: `asc`).
  * `page`: Page number (default: `1`).
  * `limit`: Items per page (default: `10`).
* **Example**: `GET /api/contacts?search=Jane&sortBy=company&order=desc&page=1&limit=5`
* **Success Response (200 OK)**:
  ```json
  {
    "contacts": [
      {
        "_id": "64b0f9f3c1d9b3d0a2f4a56a",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "phone": "+1987654321",
        "address": "456 Oak Avenue",
        "company": "Tech Corp"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 5,
      "pages": 1
    }
  }
  ```

### 3. Get Contact by ID
* **Endpoint**: `GET /api/contacts/:id`
* **Success Response (200 OK)**:
  ```json
  {
    "_id": "64b0f9f3c1d9b3d0a2f4a56a",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+1987654321",
    "address": "456 Oak Avenue",
    "company": "Tech Corp"
  }
  ```

### 4. Update a Contact
* **Endpoint**: `PUT /api/contacts/:id`
* **Request Body** (Send full or updated fields):
  ```json
  {
    "name": "Jane Doe Updated",
    "email": "jane.new@example.com",
    "phone": "+1987654321",
    "address": "789 Pine Rd",
    "company": "New Corp"
  }
  ```
* **Success Response (200 OK)**:
  ```json
  {
    "_id": "64b0f9f3c1d9b3d0a2f4a56a",
    "name": "Jane Doe Updated",
    "email": "jane.new@example.com",
    "phone": "+1987654321",
    "address": "789 Pine Rd",
    "company": "New Corp"
  }
  ```

### 5. Delete a Contact
* **Endpoint**: `DELETE /api/contacts/:id`
* **Success Response (200 OK)**:
  ```json
  {
    "message": "Contact deleted successfully"
  }
  ```
