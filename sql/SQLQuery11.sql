USE dbNdabaneUniversity;

CREATE TABLE Users (
  UserID INT PRIMARY KEY IDENTITY(1,1),
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'lecturer', 'student'))
);

