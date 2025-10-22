import { Sequelize } from 'sequelize';
import mysql from 'mysql2/promise';

// Database db_toko yang ingin dibuat
const databaseName = 'oses';
const user = 'root';
const password = ''; 
const host = 'localhost';

// Membuat database jika belum ada atau tidak EXIST
const connection = await mysql.createConnection({ host, user, password });
await connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\`;`);
await connection.end();

// Definisikan database debagai "db"
const db = new Sequelize(databaseName, user, password, {
    host: host,
    dialect: 'mysql',
    logging: false
});

export default db;
