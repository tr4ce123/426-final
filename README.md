# PokéCatch

Link to video: 

## Tools used
- React: frontend
- Express: backend node server
- MongoDB: database
- PokeAPI: 3rd party API

## Resources Served
- Users
  - username
  - password: hashed in the backend for security
 
- Pokemon

## Session persistence
For session persistence, we used `localStorage` in the browser to store a user's JWT token that is valid for one day. Everytime we request data from the backend, we call an endpoint called `/protected` that checks if the token in `localStorage` is still valid. The authToken in localStorage is set whenever a user logs in. Our entire application is wrapped in this logic so when we refresh, the user is not logged out until they have reached the one day mark in which they need to reauthenticate. The user also gets passed around as a prop, so protected components have access to a user's info.
