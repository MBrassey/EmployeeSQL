DROP DATABASE IF EXISTS employeeSQL;
CREATE DATABASE employeeSQL;
USE DATABASE employeeSQL;
DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS department;

CREATE TABLE department (
  id INT NOT NULL auto_increment PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
  id INT NOT NULL auto_increment PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT NOT NULL,
);

CREATE TABLE employee (
  id INT NOT NULL auto_increment PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT
);