import sql from 'mssql';

const config = {
  server: 'localhost',
  port: 1433,
  database: 'dbNdabaneUniversity',
  user: 'ndabane_user',
  password: 'Admin123!',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

let pool;

//connect database to access tables and data in sql server 
export const connectDB = async () => {
  try {
    pool = await sql.connect(config);
    console.log('Connected to SQL Server');
  } catch (err) {
    console.log('Database connection failed', err);
  }
};

export const getPool = () => pool;

export default sql;