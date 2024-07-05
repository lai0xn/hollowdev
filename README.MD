# Learning Platform

Welcome to the Learning Platform project! This repository contains a Go-based application that leverages GraphQL, MongoDB, and JWT for authentication to provide a robust and secure learning platform.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Setup and Installation](#setup-and-installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Overview

The Learning Platform is designed to offer a comprehensive and interactive learning experience. It uses a GraphQL server for efficient data querying and a REST server for traditional API endpoints. MongoDB is used as the database to store all the data, and JWT is used to handle authentication and ensure secure access.

## Features

- **GraphQL Server** running on port 5000 for efficient data fetching and manipulation.
- **REST Server** running on port 8080 for traditional API endpoints.
- **MongoDB** integration for a flexible and scalable database solution.
- **JWT Authentication** for secure user authentication and authorization.
- Interactive and user-friendly learning modules.
- Comprehensive API documentation.

## Architecture

- **Go:** The main programming language used for the backend.
- **GraphQL:** For querying and mutating data.
- **MongoDB:** As the database to store user and course data.
- **JWT:** For secure authentication and authorization.

## Setup and Installation

### Prerequisites

- [Go](https://golang.org/dl/) (version 1.21+)
- [MongoDB](https://www.mongodb.com/try/download/community)

### Installation Steps

1. **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/learning-platform.git
    cd learning-platform
    ```

2. **Install Go dependencies:**
    ```bash
    go mod tidy
    ```

3. **Set up MongoDB:**
    Make sure your MongoDB server is running. You can start it using:
    ```bash
    mongod
    ```

4. **Configure environment variables:**
    Create a `.env` file in the root directory and add the following variables:
    ```
    MONGO_URI=mongodb://localhost:27017/yourdbname
    JWT_SECRET=your_jwt_secret_key
    ```

5. **Run the Server server:**
    ```bash
    go run .
    ```

## Configuration

The configuration settings for the Learning Platform can be found in the `.env` file. Ensure that you update the MongoDB URI and JWT secret key as needed.

## Usage

### GraphQL Server

The GraphQL server runs on port 5000. You can access it at `http://localhost:5000/graphql`. Use tools like [GraphiQL](https://github.com/graphql/graphiql) or [Postman](https://www.postman.com/) to interact with the GraphQL API.

### REST Server

The REST server runs on port 8080. You can access it at `http://localhost:8080/api`. Use tools like [Postman](https://www.postman.com/) to test the REST API endpoints.

## API Documentation

Detailed API documentation can be found [here](./docs/api.md).

## Contributing

We welcome contributions to the Learning Platform! Please see our [CONTRIBUTING.md](./CONTRIBUTING.md) for more information on how to get started.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

