//npm install mysql and inquirer

var mysql = require ("mysql");
var inquirer= require("inquirer");

//cnnection to mysql

var connection = mysql.createConnection({
    host:"localhost",
    port: 3306,
    user: "root",
    password:"Padhai@32",
    database: "bamazon_db"
});

//initialize the connnection

connection.connect(function(err){
if(err) throw err;
console.log("Connection successful");

});