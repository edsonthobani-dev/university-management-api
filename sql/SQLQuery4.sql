USE dbNdabaneUniversity;

CREATE TABLE Enrollment (
  EnrollmentID INT PRIMARY KEY IDENTITY(1,1),
  StudentID INT NOT NULL,
  CourseID INT NOT NULL,
  EnrollmentDate DATE DEFAULT GETDATE(),
  FOREIGN KEY (StudentID) REFERENCES Student(StudentID),
  FOREIGN KEY (CourseID) REFERENCES Course(CourseID)
);