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
    header();
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
    prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "command",
            choices: commands
        }
    ])
    .then(({command}) => {
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
        console.table(res);
        init();
    });
}

const addEmployee = () => {
    let roles = [];
    let managers = [];
    db.query('SELECT role.id, role.title FROM role', (err, res) => {
        if(err) {
            console.log(err);
        }
        roles = res.map(({id, title}) => ({name: title, value: id}));
        db.query('SELECT * FROM employee', (err, res) => {
            if(err) {
                console.log(err);
            }
            managers = res.map(({id, first_name, last_name}) => ({name: first_name + " " + last_name, value: id}));
            prompt([
                {
                    type: 'input',
                    message: 'what is the employee\'s first name?',
                    name: 'firstName'
                },
                {
                    type: 'input',
                    message: 'what is the employee\'s last name?',
                    name: 'lastName'
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'what is the employee role?',
                    choices: roles
        
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: 'who is the emloyee\'s manager?',
                    choices: managers
                }
            ])
            .then(({firstName, lastName, role, manager}) => {
                db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [firstName, lastName, role, manager], (err, res) => {
                    if(err) {
                        console.log(err);
                    }
                    console.log(`${firstName} ${lastName} was added to database`);
                    init();
    
                });
                
            });
        });
        
    });
    
}

const addDepartment = () => {
    prompt([
        {
            type: 'input',
            message: 'What department do you want to add?',
            name: "newDepartment",
            validate: newDepartment => {
                if(newDepartment) {
                    return true;
                }
                else {
                    console.log("Please enter a new department.");
                }
            }
        }
    ]).then(({newDepartment}) => {
        db.query(`INSERT INTO department (name)
        VALUES (?)`, newDepartment, (err, res) => {
            if(err) {
                console.log(err);
            }
            console.log(`Added ${newDepartment} to departments.`);
            init();
        })
    });
}

const addRole = () => {
    let departments = [];
    db.query('SELECT name, id FROM department', (err, res) => {
        if(err) {
            console.log(err);
        }
        departments = res.map(({name, id}) => ({name: name, value: id}));
        prompt([
            {
                type: 'input',
                message: 'what is the title of the new role?',
                name: 'title'
            },
            {
                type: 'input',
                message: 'what is the salary of the new role?',
                name: 'salary'
            },
            {
                type: 'list',
                name: 'department',
                message: 'what department does this role belong to?',
                choices: departments
    
            }
        ])
        .then(({title, salary, department}) => {
            db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [title, salary, department], (err, res) => {
                if(err) {
                    console.log(err);
                }
                console.log(`${title} was added to database`);
                init();

            });
            
        });
    });
    
}

const updateEmployeeRole = () => {
    db.query('SELECT * FROM employee', (err, res) => {
        if(err) {
            console.log(err);
        }
        const employees = res.map(({id, first_name, last_name}) => ({name: first_name + " " + last_name, value: id}));
        db.query('SELECT role.id, role.title FROM role', (err, res) => {
            if(err) {
                console.log(err);
            }
            const roles = res.map(({id, title}) => ({name: title, value: id}));
            prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: 'which employee\'s role do you want to update?',
                    choices: employees
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'which role do you want to assign the selected employee?',
                    choices: roles  
                }
            ])
            .then(({employee, role}) => {
                db.query('UPDATE employee SET role_id = ? WHERE id = ?',[role, employee], (err, res) => {
                    if(err) {
                        console.log(err);
                    }
                    console.log(`updated employee's role`);
                    init();
                });
            });
        });
        
    });
}
