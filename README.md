# VOTING SYSTEM

## Description

a voting system where registered users can vote for their preferred candidate.

## Features

- There are two types of users: admin and normal user.
- Only the admin can add candidates for the election.
- Candidates must be registered as normal users.
- Implement measures to prevent duplicate voting.
- Add logging functionality to log events on the server.
- Ensure secure and unique user authentication.

## dbmodel

![db schema](./voting-system/src/main/resources/dbmodel.png)

## dbscript

for the database script, you can find it in the resources folder [db script](./voting-system/src/main/resources/dbscript.sql)

## REQUIREMENTS

- Java 22
- Maven
- Postgres

## installation

- clone the project
- run the dbscript.sql file to create the database
- create .env file and add the following variables

```
DB_URL=
DB_USER=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=
```

- run the project

```
 mvn spring-boot:run
```
