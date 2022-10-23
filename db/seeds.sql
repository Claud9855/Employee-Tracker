INSERT INTO department (name)
VALUES ("Finance"),
       ("IT"),
       ("Sales"),
       ("Engineer"),
       ("Customer Service"),
       ("Accounting"),
       ("Marketing");

INSERT INTO role (title, salary, department_id)
VALUES ("Help Desk", 50000, 2),
       ("Software Engineer", 100000, 4),
       ("Accountant", 90000, 6),
       ("Financial Advisor", 95000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Claudio", "Pagan", 2, 1),
       ("Emily", "Blaze", 4, 1),
       ("Bruce", "Wayne", 1, 1),
       ("Luke", "SkyWalker", 3, 1),
       ("Ken", "Clark", 4, 2);