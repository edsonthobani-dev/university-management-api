
USE dbNdabaneUniversity;
GO

INSERT INTO Student
(
    StudentNumber,
    FirstName,
    LastName,
    Email,
    ContactNumber
)
VALUES
('202500001', 'Thobani', 'Mtshiliba', 'thobani@gmail.com', '0712345678'),
('202500002', 'Edison', 'Ndabane', 'ndabane@gmail.com', '0823456789'),
('202500003', 'Alwande', 'Mtshiliba', 'alwande@gmail.com', '0834567890'),
('202500004', 'Lwandile', 'Mpangazitha', 'lwandile@gmail.com', '0845678901'),
('202500005', 'Okuhle', 'Ngangezwe', 'okuhle@gmail.com', '0725678901');


INSERT INTO Course
(
    CourseName,
    Credits,
    DurationYears
)
VALUES
('BSc Computer Science And Informatics', 360, 3),
('BA Geography', 460, 3),
('BCom Economics', 360, 4),
('BSc Mathematics', 260, 3),
('BSc Information Technology', 160, 3);

INSERT INTO Lecturer
(
    FirstName,
    LastName,
    Email,
    ContactNumber
)
VALUES
('Sipho', 'Zulu', 'sipho@ndabane.ac.za', '0711111111'),
('Nobuhle', 'Dube', 'nobuhle@ndabane.ac.za', '0722222222'),
('Peter', 'Nkosi', 'peter@ndabane.ac.za', '0733333333'),
('Nomsa', 'Dlamini', 'nomsa@ndabane.ac.za', '0744444444'),
('James', 'Mthembu', 'james@ndabane.ac.za', '0755555555');

SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_CATALOG = 'dbNdabaneUniversity'
ORDER BY TABLE_NAME, ORDINAL_POSITION;

-- Enable mixed mode isn't enough, we create a SQL login
CREATE LOGIN ndabane_user WITH PASSWORD = 'Edisonthobani0612#!';
USE dbNdabaneUniversity;
CREATE USER ndabane_user FOR LOGIN ndabane_user;
ALTER ROLE db_owner ADD MEMBER ndabane_user;