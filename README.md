# Full Stack JavaScript Developer Nanodegree - Storefront API Project

## Description

This application provides API endpoints to

- CREATE / READ / UPDATE / DELETE **`users`** data
- CREATE / READ / UPDATE / DELETE **`products`** data
- CREATE / UPDATE / DELETE **`orders`** data

## Project features

This application provides the following API routes

### Product

- `Index: '/products' [GET]`

  > http://localhost:3000/products

- `Show: '/products/:id' [GET]`

  > http://localhost:3000/products/1

- `Create [token required]: '/products' [POST]`

  > http://localhost:3000/products

  Sample JSON to be passed in body

  ```
  {
    "name": "xperia",
    "price": 45000,
    "category": "mobiles"
  }
  ```

- `Update [token required]: '/products/:id' [PUT]`

  > http://localhost:3000/products/1

  Sample JSON to be passed in body

  ```
  {
    "name": "xperia",
    "price": 46000,
    "category": "mobiles"
  }
  ```

- `Destroy [token required]: '/products/:id' [DELETE]`

  > http://localhost:3000/products/1

- `[OPTIONAL] Top 5 most popular products: 'products/top-five-most-popular' [GET]`

  > http://localhost:3000/products/top-five-most-popular

- `Get Products by order id for a user [token required]: '/users/:userId/orders/:orderId/products' [GET]`

  > http://localhost:3000/users/1/orders/1/products

### Users

- `Index [token required]: '/users' [GET]`

  > http://localhost:3000/users

- `Show [token required]: '/users/:id' [GET]`

  > http://localhost:3000/users/1

- `Create N[token required]:'/users' [POST]`

  > http://localhost:3000/users

  Sample JSON to be passed in body

  ```
  {
    "firstname": "test",
    "lastname": "user",
    "username": "testuser",
    "password": "testpassword"
  }
  ```

- `Create root user:'/create-root-user' [POST]`

  > http://localhost:3000/create-root-user

  Sample JSON to be passed in body

  ```
  {
    "firstname": "admin",
    "lastname": "user",
    "username": "admin",
    "password": "testpassword"
  }
  ```

- `Authenticate:'/users/login' [POST]`

  > http://localhost:3000/users/login

  Sample JSON to be passed in body

  ```
  {
    "username": "testuser",
    "password": "testpassword"
  }
  ```

- `Update [token required]: '/users/:id' [PUT]`

  > http://localhost:3000/users/1

  Sample JSON to be passed in body

  ```
  {
    "firstname": "fName",
    "lastname": "lName",
    "username": "testuser",
    "password": "testpassword"
  }
  ```

- `Destroy [token required]: '/users/:id' [DELETE]`

  > http://localhost:3000/users/1

### Orders

- `Current Order by user (args: user id)[token required]: '/users/:userId/orders/:orderId' [GET]`

  > http://localhost:3000/users/1/orders/1

- `Create [token required]: '/orders' [POST]`

  > http://localhost:3000/orders

  Sample JSON to be passed in body [Optional]

  ```
  {}
  ```

- `Update [token required]: '/orders/:id' [PUT]`

  > http://localhost:3000/orders/1

  Sample JSON to be passed in body

  ```
  {
    "status": "COMPLETE"
  }
  ```

- `Destroy [token required]: '/orders/:id' [DELETE]`

  > http://localhost:3000/orders/1

- `Add Product to Order [token required]: '/orders/:id/products' [POST]`

  > http://localhost:3000/orders/1/products

  Sample JSON to be passed in body

  ```
  {
    "productId": 4,
    "quantity": 5
  }
  ```

## Database Design

The following tables are created in the _postgres_ database

- users

  ```
  | Column Name | Data Type             |
  | ----------- | --------------------- |
  | id          | integer (PRIMARY KEY) |
  | firstname   | varchar               |
  | lastname    | varchar               |
  | username    | varchar               |
  | password    | varchar               |
  ```

- orders

  ```
  | Column Name | Data Type                            |
  | ----------- | ------------------------------------ |
  | id          | integer (PRIMARY KEY)                |
  | status      | varchar                              |
  | user_id     | integer (FOREIGN KEY to users table) |
  ```

- products

  ```
  | Column Name | Data Type              |
  | ----------- | ---------------------- |
  | id          | integer (PRIMARY KEY)  |
  | name        | varchar                |
  | price       | integer                |
  | category    | varchar                |
  ```

- order_products

  ```
  | Column Name | Data Type                               |
  | ----------- | --------------------------------------- |
  | id          | integer (PRIMARY KEY)                   |
  | quantity    | integer                                 |
  | order_id    | integer (FOREIGN KEY to orders table)   |
  | product_id  | integer (FOREIGN KEY to products table) |
  ```

## Project setup

---

> Original README.md

# Storefront Backend Project

## Getting Started

This repo contains a basic Node and Express app to get you started in constructing an API. To get started, clone this repo and run `yarn` in your terminal at the project root.

## Required Technologies

Your application must make use of the following libraries:

- Postgres for the database
- Node/Express for the application logic
- dotenv from npm for managing environment variables
- db-migrate from npm for migrations
- jsonwebtoken from npm for working with JWTs
- jasmine from npm for testing

## Steps to Completion

### 1. Plan to Meet Requirements

In this repo there is a `REQUIREMENTS.md` document which outlines what this API needs to supply for the frontend, as well as the agreed upon data shapes to be passed between front and backend. This is much like a document you might come across in real life when building or extending an API.

Your first task is to read the requirements and update the document with the following:

- Determine the RESTful route for each endpoint listed. Add the RESTful route and HTTP verb to the document so that the frontend developer can begin to build their fetch requests.  
  **Example**: A SHOW route: 'blogs/:id' [GET]

- Design the Postgres database tables based off the data shape requirements. Add to the requirements document the database tables and columns being sure to mark foreign keys.  
  **Example**: You can format this however you like but these types of information should be provided
  Table: Books (id:varchar, title:varchar, author:varchar, published_year:varchar, publisher_id:string[foreign key to publishers table], pages:number)

**NOTE** It is important to remember that there might not be a one to one ratio between data shapes and database tables. Data shapes only outline the structure of objects being passed between frontend and API, the database may need multiple tables to store a single shape.

### 2. DB Creation and Migrations

Now that you have the structure of the databse outlined, it is time to create the database and migrations. Add the npm packages dotenv and db-migrate that we used in the course and setup your Postgres database. If you get stuck, you can always revisit the database lesson for a reminder.

You must also ensure that any sensitive information is hashed with bcrypt. If any passwords are found in plain text in your application it will not pass.

### 3. Models

Create the models for each database table. The methods in each model should map to the endpoints in `REQUIREMENTS.md`. Remember that these models should all have test suites and mocks.

### 4. Express Handlers

Set up the Express handlers to route incoming requests to the correct model method. Make sure that the endpoints you create match up with the enpoints listed in `REQUIREMENTS.md`. Endpoints must have tests and be CORS enabled.

### 5. JWTs

Add JWT functionality as shown in the course. Make sure that JWTs are required for the routes listed in `REQUIUREMENTS.md`.

### 6. QA and `README.md`

Before submitting, make sure that your project is complete with a `README.md`. Your `README.md` must include instructions for setting up and running your project including how you setup, run, and connect to your database.

Before submitting your project, spin it up and test each endpoint. If each one responds with data that matches the data shapes from the `REQUIREMENTS.md`, it is ready for submission!
