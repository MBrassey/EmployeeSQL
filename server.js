const connection = require("./db/database");
const cTable = require("console.table");
const inquirer = require("inquirer");

connection.connect(function (err) {
  if (err) {
    console.log(err);
  }
  console.log("connection id", connection.threadId);
  viewMenue();
});

function viewMenu() {
  console.log("working");
}
