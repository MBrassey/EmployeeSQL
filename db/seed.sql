USE employeeSQL;

INSERT INTO department(name)VALUES("Sales"), ("Engeneering"),("Fincance"), ("Legal");
INSERT INTO role(title, salary, department_id)values("Sales Lead", 100000, 1), ("Salesperson", 80000, 1), ("Lead Engineer", 150000, 2), ("Software Engineer", 120000, 2), ("Accountant", 125000, 3), ("Legal Team Lead", 250000, 4), ("Lawyer", 190000, 4);
