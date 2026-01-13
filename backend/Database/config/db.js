const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, "../../.env") });

let sequelize = null;

async function initDatabase() {
    const {
        DB_HOST,
        DB_NAME,
        DB_USER,
        DB_PASSWORD,
        DB_PORT,
        DB_DIALECT
    } = process.env;

    const connectWithRetry = async (retries = 10, delay = 5000) => {
        try {
            const connection = await mysql.createConnection({
                host: DB_HOST,
                user: DB_USER,
                port: DB_PORT,
                database: DB_NAME,
                password: DB_PASSWORD
            });
            await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
            await connection.end();

            sequelize = new Sequelize(
                DB_NAME,
                DB_USER,
                DB_PASSWORD,
                {
                    host: DB_HOST,
                    dialect: DB_DIALECT,
                }
            );
            await sequelize.authenticate();
            console.log('Connection has been established successfully');
            return sequelize;

        } catch (error) {
            if (retries === 0) {
                console.error('Unable to connect to the database after multiple attempts', error);
                process.exit(1);
            }
            console.log(`Database connection failed. Retrying in ${delay / 1000} seconds... (${retries} retries left)`);
            await new Promise(res => setTimeout(res, delay));
            return connectWithRetry(retries - 1, delay);
        }
    };

    return connectWithRetry();
}

function getSequelize() {
    return sequelize;
}

module.exports = { initDatabase, getSequelize };
