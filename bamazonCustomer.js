//npm install mysql and inquirer

var mysql = require("mysql");
var inquirer = require("inquirer");
require("dotenv").config();

//cnnection to mysql
// console.log(process.env.PW);

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.PW,
    database: "bamazon_db"
});

//initialize the connnection

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connection successful");
    start();
});

//show the products in a table form  in the start using start function // table npm is yet to install

function start() {

    console.log("\n\t ------------Welcome to Bamazon Store-------------");
    showProducts();



};

function showProducts() {
    connection.query("select* from products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity + "\n");
        }
        buyProducts();

    });
};

// prompting the users to make their selection from the displayed products

function buyProducts() {
    inquirer.prompt([
        {
            name: "chosenItem",
            type: "input",
            message: " Please choose an Item ID to buy a product ",

            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                } else {
                    return ("enter a valid id from the list");
                }

            }
        },
        {
            name: "chosenQuantity",
            type: "input",
            message: " Please enter the quantity to buy?",

            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                } else {
                    return ("Please enter a number");
                }

            }
        }
    ])
        .then(function (answer) {

            connection.query(`SELECT * from products WHERE item_id = ${answer.chosenItem}`, function (err, res) {

                if (err) throw err;

                for (var i = 0; i < res.length; i++) {

                    console.log("Your Product choice is : " + res[i].product_name);
                    console.log("We currently have a quantity of: " + res[i].stock_quantity);
                    if (res[i].stock_quantity < answer.chosenQuantity) {
                        console.log("Sorry! There is not enough quantity of this product in the stock");
                        nextPurchase();
                    }

                    else {

                        console.log("your order has been placed.");
                        //console.log("are you sure you want to buy"+ answer.chosenQuantity);
                        console.log("Your total purchase for " + answer.chosenQuantity + " " + res[i].product_name + " " + "was: " + res[i].price * answer.chosenQuantity);

                        var newQuantity = res[i].stock_quantity - answer.chosenQuantity;
                        console.log("we have now " + newQuantity + " " + "in stock");
                        connection.query("Update products SET stock_quantity = " + newQuantity + "WHERE item_id = " + res[i].item_id, function (err, res) {
                            // if (err) throw err;
                            // console.log("Thanks for shopping!")
                            nextPurchase();

                        });

                    };


                };

            });

        });
};
function nextPurchase() {
    inquirer.prompt([
        {
            name: "continue",
            type: "confirm",
            message: "Would you like to buy another product?"
        }
    ])
        .then(function (answer) {
            if (answer.continue == true) {
                console.log("\n" +"Please choose another product"+"\n");
                showProducts();
            } else {
                console.log("Thanks for shopping");
                connection.end();
            }
        });
};


