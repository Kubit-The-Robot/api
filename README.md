# Kubit API

> Kubit Application MVC, Docker and ES6 syntax

[![Build Status](http://img.shields.io/travis/badges/badgerbadgerbadger.svg?style=flat-square)](https://travis-ci.org/badges/badgerbadgerbadger)

## Table of Contents

-   [Installation](#installation)
-   [Features](#features)
-   [License](#license)

## Installation

### Download

-   Clone the repo using the following link:
    `https://github.com/EnzoBtv/kubit-api`

-   Download the LTS version of docker and docker-compose

### Setup and Execution

To run the application, in the root folder of the project, run:

```sh
$ sudo docker-compose up
```

> It can take a little while because backend wait postgres to be available to receive connections

-   After docker finishes its internal processes, you will have 2 services:

-   A backend service, on the port 3333.
-   A PostgresSQL database on the default port 5432.

> You can shut down the services using:

```shell
$ sudo docker-compose down
```

## Features

> Users can authenticate in the app using the route /auth POST

## Technology

> Docker

-   One container containing backend service using a PostgresSQL database;
-   Another one containing a PostgreSQL database;
-   Use of Docker-compose.

> Backend

-   Very scalable NodeJS architecture with Controllers and models being added automaticaly;
-   Routes protected from basic security attacks as DDoS;
-   Use of Node cluster system;

## License

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

-   **[MIT license](http://opensource.org/licenses/mit-license.php)**
