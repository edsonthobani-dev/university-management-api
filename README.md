# Ndabane University Management API

A full-featured REST API built with Node.js, Express, and Microsoft SQL Server for managing university students, courses, lecturers, enrollments and marks.

## 🚀 Tech Stack
- Node.js
- Express.js
- Microsoft SQL Server
- JWT Authentication
- bcrypt
- express-validator
- Swagger/OpenAPI

## 📖 API Documentation
Run the server and visit: http://localhost:5000/api-docs

## 🔐 Authentication
This API uses JWT Bearer tokens. Register and login to get a token, then include it in the Authorization header:
Authorization: Bearer your_token_here

## 👥 Roles
| Role | Permissions |
|------|-------------|
| Admin | Full access to everything |
| Lecturer | Add and update marks, view enrollments |
| Student | View own information |

## 📌 Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login

### Students
- GET /api/students
- GET /api/students?search=name
- GET /api/students/:id
- POST /api/students (admin only)
- PUT /api/students/:id (admin only)
- DELETE /api/students/:id (admin only)

### Courses
- GET /api/courses
- GET /api/courses?search=name
- GET /api/courses/:id
- POST /api/courses (admin only)
- PUT /api/courses/:id (admin only)
- DELETE /api/courses/:id (admin only)

### Lecturers
- GET /api/lecturers
- GET /api/lecturers?search=name
- GET /api/lecturers/:id
- POST /api/lecturers (admin only)
- PUT /api/lecturers/:id (admin only)
- DELETE /api/lecturers/:id (admin only)

### Enrollments
- GET /api/enrollments (admin only)
- GET /api/enrollments/student/:studentId
- GET /api/enrollments/course/:courseId
- POST /api/enrollments (admin, lecturer)
- DELETE /api/enrollments/:id (admin only)

### Marks
- GET /api/marks (admin only)
- GET /api/marks/student/:studentId
- GET /api/marks/course/:courseId
- POST /api/marks (admin, lecturer)
- PUT /api/marks/:id (admin, lecturer)
- DELETE /api/marks/:id (admin only)
