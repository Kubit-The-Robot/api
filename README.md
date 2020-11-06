# Kubit API

> Kubit Application MVC and ES6 syntax

## Table of Contents

-   [Installation](#installation)
-   [Features](#features)
-   [License](#license)

## Installation

### Download

-   Clone the repo using the following link:
    `https://github.com/Kubit-The-Robot/api`

-   Download the 13.5.0 version of NodeJS

-   Download MySQL database

### Setup and Execution

-   Start MySQL Database on the port of your preference

-   Run the generate.sql on your database

-   To run the application, in the root folder of the project create a .env file. Like this:

```env
PORT=3000
DB_HOST=localhost
DB_USERNAME=root
DB_PASSWORD=root
SECRET=secret
```

#### Run Local

-   With NodeJS and NPM already installed, run:

```env
$ npm install -g nodemon
$ npm run start
```

## Technology

-   Very scalable NodeJS architecture with Controllers and models being added automaticaly;
-   Routes protected from basic security attacks as DDoS;
-   Fast and Reliable API
-   All logging gets saved to a file
