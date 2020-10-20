const connection = require("./db/database");
const cTable = require("console-table");
const inquirer = require("inquirer");
const banner = require("./lib/banner");

connection.connect(function (err) {
  if (err) {
    console.log(err);
  }
  console.log("connection id", connection.threadId);
  init();
});

init = () => {
  return banner;
};
