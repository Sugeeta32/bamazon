//npm install mysql and inquirer

var mysql = require("mysql");
var inquirer = require("inquirer");
require("dotenv").config();

//cnnection to mysql

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Padhai@32",//process.env.PW
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
            message: " Please choose an item number to buy ",

            validate: function (value) {
                if (isNaN(value) === false && value !== "") {
                    return true;
                }
                return false;
            }
        },
        {
            name: " chosenQuantity",
            type: "input",
            message: " Please enter the quantity to buy?",

            validate: function (value) {
                if (isNaN(value) === false && value !== "") {
                    return true;
                }
                return ("Please enter a number");
            }
        }
    ]).then(function (answer) {

        connection.query(`SELECT * from products WHERE item_id = ${answer.chosenItem}`, function (err, res) {
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                console.log("Your Product choice is : " + res[i].product_name);
                console.log("We currently have a quantity of: " + res[i].stock_quantity);
                if (res[i].stock_quantity < answer.chosenQuantity) {
                    console.log("Sorry! There is not enough quantity of this product in the stock");
                    nextPurchase();
                } else {

console.log("your order has been placed.")
                }


            }

        })

    })
};


//============================//
// function postAuction() {
//     // prompt for info about the item being put up for auction
//     inquirer
//       .prompt([
//         {
//           name: "item",
//           type: "input",
//           message: "What is the item you would like to submit?"
//         },
//         {
//           name: "category",
//           type: "input",
//           message: "What category would you like to place your auction in?"
//         },
//         {
//           name: "startingBid",
//           type: "input",
//           message: "What would you like your starting bid to be?",
//           validate: function(value) {
//             if (isNaN(value) === false) {
//               return true;
//             }
//             return false;
//           }
//         }
//       ])
//       .then(function(answer) {
//         // when finished prompting, insert a new item into the db with that info
//         connection.query(
//           "INSERT INTO auctions SET ?",
//           {
//             item_name: answer.item,
//             category: answer.category,
//             starting_bid: answer.startingBid || 0,
//             highest_bid: answer.startingBid || 0
//           },
//           function(err) {
//             if (err) throw err;
//             console.log("Your auction was created successfully!");
//             // re-prompt the user for if they want to bid or post
//             start();
//           }
//         );
//       });