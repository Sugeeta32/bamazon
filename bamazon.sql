create database bamazon_db;
use bamazon_db;

create table products(
    item_id int not null auto_increment,
    product_name varchar(50) not null,
    department_name varchar(50) not null,
    price decimal(6,2) not null,
    stock_quantity int(10) not null,
    primary key(item_id)
);

