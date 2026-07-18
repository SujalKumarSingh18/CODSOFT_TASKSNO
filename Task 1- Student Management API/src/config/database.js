const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

// Retrieve DB path from environment variables, fallback to local path
const dbPath = path.resolve(__dirname, '../../', process.env.DB_PATH || './src/database.sqlite');

// Initialize the database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Could not connect to database:', err.message);
  } else {
    console.log('Connected to the SQLite database at:', dbPath);
    initializeTables();
  }
});

function initializeTables() {
  db.serialize(() => {
    // Enable Foreign Key constraints in SQLite (disabled by default in SQLite!)
    db.run('PRAGMA foreign_keys = ON;', (err) => {
      if (err) console.error('Failed to enable foreign keys:', err.message);
    });

    // Create the "students" table to hold student profile information
    const createStudentsTable = `
      CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        date_of_birth DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create the "courses" table to hold the academic course listings
    const createCoursesTable = `
      CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        course_code VARCHAR(10) UNIQUE NOT NULL,
        title VARCHAR(100) NOT NULL,
        credits INTEGER NOT NULL,
        description TEXT
      );
    `;

    // Create the "enrollments" junction table mapping students to courses.
    // Utilizes ON DELETE CASCADE for foreign key references, and UNIQUE key mapping
    // to prevent duplicate student-course enrollments.
    const createEnrollmentsTable = `
      CREATE TABLE IF NOT EXISTS enrollments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        course_id INTEGER NOT NULL,
        enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        grade CHAR(2),
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
        UNIQUE (student_id, course_id)
      );
    `;

    // Execute the table creation queries
    db.run(createStudentsTable, (err) => {
      if (err) console.error('Error creating students table:', err.message);
      else console.log('Students table initialized.');
    });

    db.run(createCoursesTable, (err) => {
      if (err) console.error('Error creating courses table:', err.message);
      else console.log('Courses table initialized.');
    });

    db.run(createEnrollmentsTable, (err) => {
      if (err) console.error('Error creating enrollments table:', err.message);
      else console.log('Enrollments table initialized.');
    });
  });
}

module.exports = db;
