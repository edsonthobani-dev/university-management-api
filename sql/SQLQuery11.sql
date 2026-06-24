USE dbNdabaneUniversity;

CREATE TABLE Users (
  UserID INT PRIMARY KEY IDENTITY(1,1),
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'lecturer', 'student'))
);

USE dbNdabaneUniversity;

CREATE TABLE Marks (
  MarkID INT PRIMARY KEY IDENTITY(1,1),
  StudentID INT NOT NULL,
  CourseID INT NOT NULL,
  Mark DECIMAL(5,2) NOT NULL CHECK (Mark >= 0 AND Mark <= 100),
  Grade VARCHAR(5),
  DateRecorded DATE DEFAULT GETDATE(),
  FOREIGN KEY (StudentID) REFERENCES Student(StudentID),
  FOREIGN KEY (CourseID) REFERENCES Course(CourseID)
);