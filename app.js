const mysql = require("mysql2");
const {prompt} = require("inquirer");
const cTable = require("console.table");
const figlet = require("figlet");
require("dotenv").config();

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
);

db.connect((err) => {
    if(err) {
        console.log(err);
    }
    console.log(`Connection id: ${db.threadId}` );
    init();
});

const header = () => {
    console.log(figlet.textSync("Employee Manager", {
        font: 'Standard',
        horizontalLayout: 'fitted',
        verticalLayout: 'fitted',
        width: 90,
        whitespaceBreak: true
    }));
}


const commands = ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Roles", "View All Departments", "Add Department", "Quit"];

const init = () => {
    //header();
    prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "command",
            choices: commands
        }
    ]).then(({command}) => {
        if(command === commands[0]){
            viewAllEmployees();
        }
        else if(command === commands[1]) {
            addEmployee();
        }
        else if(command === commands[2]) {
            updateEmployeeRole();
        }
        else if(command === commands[3]) {
            viewAllRoles();
        }
        else if(command === commands[4]) {
            addRole();
        }
        else if(command === commands[5]) {
            viewAllDepartments();
        }
        else if(command === commands[6]) {
            addDepartment();
        }
        else if(command === commands[7]) {
            prompt([
                {
                    type: 'list',
                    message: 'Are you sure you want to quit?',
                    name: 'userQuit',
                    choices: ["Main Menu", "Quit"]
                }
            ]).then(({userQuit}) => {
                if(userQuit === "Main Menu") {
                    init();
                }
                else {
                    console.log("Bye....");
                    process.exit(0);
                }
            });
        }
    });
}

const viewAllDepartments = () => {
    db.query("SELECT * FROM department", (err, res) => {
        if(err) {
            console.log(err);
        }
        console.log();
        console.table(res);
        init();
    });
}

const viewAllEmployees = () => {
    db.query(`SELECT employee.id, 
    employee.first_name, 
    employee.last_name, 
    role.title, 
    department.name AS department,
    role.salary, 
    CONCAT (manager.first_name, " ", manager.last_name) AS manager
FROM employee
     LEFT JOIN role ON employee.role_id = role.id
     LEFT JOIN department ON role.department_id = department.id
     LEFT JOIN employee manager ON employee.manager_id = manager.id`, (err, res) => {
        if(err) {
            console.log(err);
        }
        console.log();
        console.table(res);
        init();
    });
}

const viewAllRoles = () => {
    db.query(`SELECT role.id, role.title, department.name AS department, role.salary FROM role
    INNER JOIN department ON role.department_id = department.id`, (err, res) => {
        if(err) {
            console.log(err);
        }
        console.log();
        console.table(res);
        init();
    });
}

const addEmployee = () => {

}

const addDepartment = () => {

}

const addRole = () => {

}

const updateEmployeeRole = () => {
    
}

// init();