const mysql = require("mysql2");
const {prompt} = require("inquirer");
const cTable = require("console.table");

require("dotenv").config();

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
);