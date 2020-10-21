DROP DATABASE IF EXISTS `EmployeeSQL`;
CREATE DATABASE if not EXISTS `EmployeeSQL`;
USE `EmployeeSQL`; 
DROP TABLE IF EXISTS `EmployeeSQL`.`employee`;
DROP TABLE IF EXISTS `EmployeeSQL`.`role`;
DROP TABLE IF EXISTS `EmployeeSQL`.`department`;

CREATE TABLE department (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(16,2) NOT NULL,
    department_id INTEGER ,
    index department_id(department_id),
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
    
);

CREATE TABLE employee (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER,
    manager_id INTEGER,
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL,
    CONSTRAINT fk_employee FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);

INSERT INTO department(name)VALUES("Sales"), ("Engeneering"),("Fincance"), ("Legal");
INSERT INTO role(title, salary, department_id)values("Sales Lead", 100000, 1), ("Salesperson", 80000, 1), ("Lead Engineer", 150000, 2), ("Software Engineer", 120000, 2), ("Accountant", 125000, 3), ("Legal Team Lead", 250000, 4), ("Lawyer", 190000, 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Matt', 'Brassey', 1, null),
('Vitalik', 'Buterin', 1, 1),
('Jeff', 'Berwick', 2, 2),
('Ron', 'Paul', 3, 1),
('Ichigo', 'Kurosaki', 3, 2),
('Bat', 'Man', 3, 1),
('Son', 'Goku', 2, 2),
('Bruce', 'Lee', 3, 1),
('Sauske', 'Uchia', 4, null);