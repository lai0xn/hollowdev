
Character Management API

This project is a simple Character Management API built with Node.js, Express, and MongoDB.it supports essential CRUD operations (create, read, update, and delete) with robust validation and error handling.

The API includes endpoints to
- Create a new character (POST /api/Character) with attributes {
  "name": "CharacterName",
  "level" "attributes" {"strength" "agility" "intelligence" "endurance" } are set to value = 1 by default and "hp" = 1000}
- retrieve all characters with pagination (GET /api/Character),
- retrieve a character by name (GET /api/Character/name/:name), 
- update a character by name (PUT /api/Character/name/:name),
- delete a character by name (DELETE /api/Character/name/:name).

Character model 
every character is characterized by a name , level , hp , strength , agility , intelligence , endurance

Validation rules 
validate the request body for POST and PUT requests.
- ensure that name is not empty, 
- level is an integer between 1 and 100 (optional, default: 1), 
- hp is between 0 and 1000 (optional, default: 1000),
- attributes (strength, agility, intelligence, endurance) are integers between 1 and 10 (optional, default: 1).

Error handling 
- 404 for not found : Returned when an endpoint does not exist or a character is not found.
- 500 for server errors : Returned for server errors, such as database connection failures.









