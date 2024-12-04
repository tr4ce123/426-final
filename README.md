# PokéCatch

Link to video: https://www.youtube.com/watch?v=LSMLaRGj5qs&ab_channel=WeiJiang

## Tools used
- React + Tailwind: event-driven frontend
- Express: backend node server
- MongoDB: database
- PokeAPI: 3rd party API

Our frontend is very interactive and event-driven as you will see in our demo video!
To make a pleasing design, we used Tailwind in our tsx files instead of separate stylesheets.

## RESTful CRUD API serving 3 resources
- Users
  - id
  - username
  - password: hashed in the backend for security
 
- Pokemon
  - id
  - username: the user the Pokemon belongs to
  - pokemonId: the ID of the Pokemon from PokeAPI
  - imageUrl
  - catchTimestamp: when the Pokemon was caught

- Pokemon Details
  - id: the id from PokeAPI
  - height
  - name
  - stats: an array of objects holding a Pokemon's stats
  - types: an array of strings to represent the type of a Pokemon
 
All of our resources support CRUD functionality and are served by various endpoints found in our `server.js` file. We can create a Pokemon by randomly generating an ID from 1 - 898 (all Pokemon available via PokeAPI). This makes a GET request to PokeAPI, then resolving the POST request sent by the user of our application by loading up our Pokemon document with the response from PokeAPI. A user can update any of their Pokemons' names via a PUT request and if a user isn't happy with their Pokemon, they can DELETE them from their Pokedex. The same applies for Users

## Session persistence and User Authentication
For session persistence, we decided to go with proper user authentication. To implement this, we used the browser's `localStorage` to hold an item called `authToken`. When a user creates their account, their password is hashed using `bcrypt` before storing it in our database for protection. When a user logs in, we validate their username and password and generate a JWT token using their username and a JWT_SECRET environment variable. As a response, our `/login` endpoint sends this token to the frontend where it is put into `localStorage` as an `authToken` for session persistence. When we refresh the page or exit the page, the user stays logged in and all of their Pokemon are saved in the database. 

Every time we request data from the backend, we call an endpoint called `/protected` that checks if the token in `localStorage` is valid. For each `ProtectedRoute` (every page that holds user-specific data), we call this endpoint to validate the user and ensure their `authToken` has not expired. The user also gets passed around as a prop, so protected components have access to a user's info.
