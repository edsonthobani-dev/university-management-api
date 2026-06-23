import sql from 'mssql';

const config = {
  server: 'localhost',
  port: 1433,
  database: 'dbNdabaneUniversity',
  user: 'ndabane_user',
  password: 'Edisonthobani0612#!',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

let pool;

export const connectDB = async () => {
  try {
    pool = await sql.connect(config);
    console.log('Connected to SQL Server ✔');
  } catch (err) {
    console.log('Database connection failed ❌', err);
  }
};

export const getPool = () => pool;

export default sql;