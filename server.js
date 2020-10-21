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
