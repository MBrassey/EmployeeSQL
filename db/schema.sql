DROP DATABASE IF EXISTS `EmployeeSQL`;
CREATE DATABASE if not EXISTS `EmployeeSQL`;
USE `EmployeeSQL`; 
DROP TABLE IF EXISTS `EmployeeSQL`.`employee`;
DROP TABLE IF EXISTS `EmployeeSQL`.`roles`;
DROP TABLE IF EXISTS `EmployeeSQL`.`department`;

CREATE TABLE IF NOT EXISTS `EmployeeSQL`.`department` (
  id INT NOT NULL auto_increment PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS `EmployeeSQL`.`employee` (
  id INT NOT NULL auto_increment PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT
);

CREATE TABLE IF NOT EXISTS `EmployeeSQL`.`roles` (
  id INT NOT NULL auto_increment PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT NOT NULL
);