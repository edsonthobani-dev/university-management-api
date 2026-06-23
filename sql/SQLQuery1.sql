CREATE DATABASE dbNdabaneUniversity;
GO

USE dbNdabaneUniversity;
GO

CREATE TABLE Student
(
    StudentID INT IDENTITY(1,1) PRIMARY KEY,
    StudentNumber CHAR(9) NOT NULL UNIQUE,
    FirstName VARCHAR(max) NOT NULL,
    LastName VARCHAR(max) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    ContactNumber VARCHAR(max) NOT NULL
);

CREATE TABLE Course
(
    CourseID INT IDENTITY(1,1) PRIMARY KEY,
    CourseName VARCHAR(max) NOT NULL,
    Credits INT NOT NULL,
    DurationYears INT NOT NULL
);

CREATE TABLE Lecturer
(
    LecturerID INT IDENTITY(1,1) PRIMARY KEY,
    FirstName VARCHAR(max) NOT NULL,
    LastName VARCHAR(max) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    ContactNumber VARCHAR(max) NOT NULL
);