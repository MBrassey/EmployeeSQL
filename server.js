const connection = require("./db/database");
const inquirer = require("inquirer");
const banner = require("./lib/banner");

connection.connect(function (err)
{
	if (err)
	{
		console.log(err);
	}
	//console.log("connection id", connection.threadId);  // If needed
	init();
});

init = () =>
{
	banner;
	return inquirer
		.prompt(
		{
			name: 'initialAction',
			type: 'list',
			message: 'What would you like to do?',
			choices: [
				"View Departments",
				"View Roles",
				"View Employees",
				"Add Department",
				"Add Role",
				"Add Employee",
        "Update Employee's Role",
        "Delete Employee",
        "Delete Role",
				"Exit"
			]
		})
		.then(function (answer)
		{
			switch (answer.initialAction)
			{
			case "View Departments":
				viewDepartments();
				break;
			case "View Roles":
				viewRoles();
				break;

			case "View Employees":
        viewEmployees();
        init();
				break;

			case "Add Department":
        addDepartment();
				break;

			case "Add Role":
        addRole();
				break;

			case "Add Employee":
				addEmployee();
				break;

			case "Update Employee's Role":
				updateRole();
        break;

			case "Delete Employee":
        deleteEmployee();
        break;

			case "Delete Role":
        deleteRole();
        break;

			case "Exit":
				connection.end();
			}
		});
}

// View employees
const viewEmployees = () =>
{
	const sql =
		`SELECT e.id,
     e.first_name,
     e.last_name,
     role.title,
     department.name AS department,
     role.salary,
     CONCAT(e_manager.first_name, " ", e_manager.last_name) AS manager
     FROM employee e
     LEFT JOIN employee e_manager ON e.manager_id = e_manager.id
     LEFT JOIN role ON e.role_id = role.id
     LEFT JOIN department ON role.department_id = department.id`

	connection.query(sql, function (err, res)
	{
		if (err) throw err;
		for (i = 0; i < res.length; i++)
		{
			console.log("");
      console.table(res[i]);
		}
	});
};

// View roles
const viewRoles = () =>
{
	const roleQuery = `SELECT *, department.name as Department FROM role
           LEFT JOIN department ON role.department_id = department.id
           ORDER BY title; `
	connection.query(roleQuery, function (err, results)
	{
		if (err) throw err;
		console.log("");
		console.table(results);
	})
	init();
};

// View departments
const viewDepartments = () =>
{
	connection.query('SELECT * FROM department', function (err, results)
	{
		if (err) throw err;
		console.log("");
		console.table(results);
  })
  init();
};

// Add department
const addDepartment = () =>
{
	inquirer
		.prompt(
		{
			name: "addDepartment",
			type: "input",
			message: "What is the name of the new department?",
			// validate input is a string
			validate: addDepartmentInput =>
			{
				if (addDepartmentInput.match("[a-zA-Z]+$"))
				{
					return true;
				}
				else
				{
					console.log("Expecting a string! Please try again.");
					return false;
				}
			}
		})
		.then((answer) =>
		{
			let newDepartment = 'INSERT INTO department (name) VALUES( ? )';
			connection.query(newDepartment, answer.addDepartment, function (err, results)
			{
				if (err) throw err;
        console.log(`Department added successfully: ${(answer.addDepartment). toUpperCase()}`)
        init();
      });
		})
}

// Add role
const addRole = () =>
{
	const deptSQL = `SELECT * FROM department;`
	connection.query(deptSQL, (err, res) =>
	{
		if (err) throw err;
		inquirer
			.prompt([
			{
				name: 'title',
				type: 'input',
				message: 'Enter title for the new role:',
				validate: roleTitle =>
				{
					if (roleTitle.match("[a-zA-Z]+$"))
					{
						return true;
					}
					else
					{
						console.log("Expecting a string! Please try again.");
						return false;
					}
				}
			},
			{
				name: 'salary',
				type: 'input',
				message: 'Enter salary for the new role:',
				validate: roleSalary =>
				{
					if (roleSalary.match("[0-9]+$"))
					{
						return true;
					}
					else
					{
						console.log("Invalid Input!");
					}
				}
			},
			{
				name: 'departmentName',
				type: 'list',
				message: 'Enter department the role belongs to:',
				choices: () =>
				{
					let choiceArray = [];
					res.forEach(res =>
					{
						choiceArray.push(
							res.name
						);
					})
					return choiceArray;
				}
			}])
			.then((answer) =>
			{
				const department = answer.departmentName;
				connection.query(`SELECT * FROM department`, (err, res) =>
				{
					if (err) throw err;

					let departmentIte = res.filter((res) =>
					{
						return res.name == department;
					});
					let id = departmentIte[0].id;
					let newRole = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
					let params = [answer.title, answer.salary, id];
					console.log(params);
					connection.query(newRole, params, (err, res) =>
					{
            if (err) throw err;
            console.log("");
            console.log(`Role added successfully: ${(params[0]).toUpperCase()}`);
            init();
					});
				});
			});
	});
}

// Add employee
const addEmployee = () =>
{
	const rolesQuery = `SELECT title from role;`;
	connection.query(rolesQuery, (err, res) =>
	{
		if (err) throw err;
		const title = [];
		for (j = 0; j < res.length; j++)
		{
			title.push(res[j].title)
		}

		connection.query("SELECT first_name, last_name from employee", (err, res) =>
		{
			var managerName = ['none'];
			if (err) throw err;

			for (k = 0; k < res.length; k++)
			{
				var first_name = res[k].first_name;
				var last_name = res[k].last_name;
				managerName.push(first_name + " " + last_name);
			}
			inquirer
				.prompt([
				{
					name: "firstName",
					type: "input",
					message: "Enter employee's first name:",
					validate: addEmployeeName =>
					{
						if (addEmployeeName.match("[a-zA-Z]+$"))
						{
							return true;
						}
						else
						{
							console.log("Expecting a string! Please try again.");
							return false;
						}
					}
				},
				{
					name: "lastName",
					type: "lastName",
					message: "Enter employee's last name:",
					validate: addEmployeeLName =>
					{
						if (addEmployeeLName.match("[a-zA-Z]+$"))
						{
							return true;
						}
						else
						{
							console.log("Expecting a string! Please try again.");
							return false;
						}
					}
				},
				{
					name: "title",
					type: "list",
					message: "Enter the employee's role:",
					choices: title
				},
				{
					name: "manager",
					type: "list",
					message: "Select the employee's manager:",
					choices: managerName
				}])
				.then((
				{
					firstName,
					lastName,
					title,
					manager
				}) =>
				{
					const roleIdQuery = `SELECT id FROM role WHERE title = ?`;
					const params1 = [title];
					connection.query(roleIdQuery, params1, (err, res) =>
					{
						if (err) throw err;
            var roleId = res[0].id;
						var managerId;
						if (manager === 'none')
						{
              if (err) throw err;
              managerId = null;
              const newEmployee = `INSERT into employee(first_name, last_name, role_id, manager_id) values(?,?,?,?);`;
              const params4 = [firstName, lastName, roleId, managerId];
              connection.query(newEmployee, params4, function (err, res)
              {
                if (err) throw err;
                console.log(`Employee added successfully: ${firstName} ${lastName} !`);
                init();
              });
						}
						else
						{
							var managersName = manager.split(" ");
							const idQuery = `SELECT id FROM employee where (first_name = ? and last_name = ?)`;
							const params3 = [managersName[0], managersName[1]];
							connection.query(idQuery, params3, (err, res) =>
							{
								if (err) throw err;
								managerId = res[0].id;
								const newEmployee2 = `INSERT into employee(first_name, last_name, role_id, manager_id) values(?,?,?,?);`;
								const params4 = [firstName, lastName, roleId, managerId];
								connection.query(newEmployee2, params4, function (err, res)
								{
									if (err) throw err;
									console.log(`Employee added successfully: ${firstName} ${lastName} !`);
									init();
								});
							});
						}
					});
				});
		});
	});
}

// Update employee role
const updateRole = () =>
{
	const roletitle1 = `SELECT title from role`;
	connection.query(roletitle1, (err, res) =>
	{
		if (err) throw err;

		var role = [];
		var employeeUpdate = [];
		for (i = 0; i < res.length; i++)
		{
			role.push(res[i].title);
		}
		const getName = `SELECT first_name, last_name from employee`;
		connection.query(getName, (err, res) =>
		{
			if (err) throw err;

			for (k = 0; k < res.length; k++)
			{
				var first_name = res[k].first_name;
				var last_name = res[k].last_name;
				employeeUpdate.push(first_name + " " + last_name);
			}
			inquirer
				.prompt([
				{
					name: "pickEmployee",
					type: "list",
					message: "Select employee to update:",
					choices: employeeUpdate
				},
				{
					name: "newRole",
					type: "list",
					message: "Select employees role:",
					choices: role
				}, ])
				.then((
				{
					pickEmployee,
					newRole
				}) =>
				{
					const roleId2 = `SELECT id from role where title = ?`
					const params7 = [newRole];

					connection.query(roleId2, params7, (err, res) =>
					{
						if (err) throw err;
						var roleId = res[0].id;
						var name = pickEmployee.split(" ");

						const newRoleId = `UPDATE employee set role_id = ? WHERE first_name = ? and last_name = ?`;
						const params8 = [roleId, name[0], name[1]];

						connection.query(newRoleId, params8, (err, res) =>
						{
              if (err) throw err;
              console.log("");
							console.log(`Employee role updated successfully: ${newRole}`);
              init();
						})
					})
				})
		})
	})
}

// Delete Employee
const deleteEmployee = () =>
{
  // Get list of employees for inquirer
	const deleteQuery = `SELECT first_name, last_name FROM employee`;
	connection.query(deleteQuery, (err, res) =>
	{
		var name = [];
		if (err) throw err;

		for (k = 0; k < res.length; k++)
		{
			var firstname = res[k].first_name;
			var lastname = res[k].last_name;
			console.table(firstname + lastname)
			name.push(firstname + " " + lastname)
		}
		inquirer
			.prompt([
			{
				name: "employee",
				type: "list",
				message: "Select employee to delete:",
				choices: name
			}])
			.then((
			{
				employee
			}) =>
			{
				var selectEmp = employee.split(" ");
				const empId = `SELECT id from employee where (first_name = ? and last_name = ?)`;
        const params10 = [selectEmp[0], selectEmp[1]];

				connection.query(empId, params10, (err, res) =>
				{
					if (err) throw err;
					const delEmp = `DELETE FROM employee WHERE id = ?;`;
					const params11 = [res[0].id];
					connection.query(delEmp, params11, (err, res) =>
					{
						console.log(`Employee deleted successfully: ${employee} !`);
						init();
					});
				});
			});
	});
}

// Delete Role
const deleteRole = () =>
{
  // Get list of roles for inquirer
	const deleteQuery2 = `SELECT title FROM role`;
	connection.query(deleteQuery2, (err, res) =>
	{
		var role2 = [];
		if (err) throw err;
		for (k = 0; k < res.length; k++)
		{
			role2.push(res[k].title);
		}
		inquirer
			.prompt([
			{
				name: "role",
				type: "list",
				message: "Select role to delete:",
				choices: role2
			}])
			.then((
			{
				role
			}) =>
			{
				const roleId = `SELECT id from role where title = ?`;
				connection.query(roleId, role, (err, res) =>
				{
          if (err) throw err;
					const delRole = `DELETE FROM role WHERE id = ?;`;
					const params11 = [res[0].id];
					connection.query(delRole, params11, (err, res) =>
					{
						console.log(`Role deleted successfully: ${role} !`);
						init();
					});
				});
			});
	});
}