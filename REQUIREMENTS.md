# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Products

- Index: 'products' [GET]
- Show: 'products/:id' [GET]
- Create [token required]: 'products' [POST]
- [OPTIONAL] Top 5 most popular products: 'products/top-five-most-popular' [GET]
- [OPTIONAL] Products by category (args: product category): -

#### Users

- Index [token required]: 'users' [GET]
- Show [token required]: 'users/:id' [GET]
- Create: 'users' [POST]

#### Orders

- Current Order by user (args: user id)[token required]: 'users/:userId/orders/:orderId' [GET]
- [OPTIONAL] Completed Orders by user (args: user id)[token required]: -

## Data Shapes

#### Product

- id
- name
- price
- [OPTIONAL] category

#### User

- id
- firstName
- lastName
- password

#### Orders

- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

## Database Schema

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
