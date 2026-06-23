USE dbNdabaneUniversity
GO

CREATE LOGIN ndabane_user WITH PASSWORD = 'Edisonthobani0612#!';
USE dbNdabaneUniversity;
CREATE USER ndabane_user FOR LOGIN ndabane_user;
ALTER ROLE db_owner ADD MEMBER ndabane_user;

EXEC xp_loginconfig 'login mode';

USE master;
ALTER LOGIN ndabane_user ENABLE;
ALTER LOGIN ndabane_user WITH PASSWORD = 'Edisonthobani0612#!';
USE dbNdabaneUniversity;
ALTER ROLE db_owner ADD MEMBER ndabane_user;