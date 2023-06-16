# Vacation rentals back-end project

# Project description

The purpose of this application is to create, display and remove vacation rental records. It provides routes for signup, login and logout. Regular users are able to create a record, retrieve any record and remove their own items. Admin users are able create, retrieve and remove any record. This is handled by a simple authorization. All users are able to add items to their vacation rentals cart, as well as display and remove them from there. All users can search through the vacation rentals in the database.

The application will use the bcrypt library for securely storing passwords. Only authenticated users can access the protected API routes. Additionally, authentication is handled by generating random tokens with the use of the uuid library.

# Technical components

## Routes

Login

-	Signup: POST /login/signup – uses bcrypt on the incoming password. Stores user with their email and encrypted password, handles conflicts when the email is already in use
-	Login: POST /login – finds the user with the provided email. Uses bcrypt to compare stored password with the incoming password. If they match, generates a random token with uuid and returns it to the user
-	Logout: POST /login/logout – If the user is logged in, invalidates their token so they can't use it again

Bnbs (requires authentication)

-	Get all bnbs: GET /bnbs (doesn’t require authentication)
-	Get specific bnb: GET /bnbs/:id (doesn’t require authentication)
-	Search bnbs: GET /bnbs/search (doesn’t require authentication)
-	Create a bnb record: POST /bnbs
-	Remove a bnb record: DELETE /bnbs/:id – regular users can only delete their own records. Users with the "admin" role can remove any record. A record can be removed only if it is not in the user’s cart

Vacation rentals cart (requires authentication)

-	Get all items in the cart for a particular user: GET /cart
-	Add a record to the cart for a particular user: POST /cart
-	Remove a record from the cart for a particular user: DELETE /cart/:id

## Middleware

-	A middleware that checks if the user has a valid token

## DAOs

Token

-	makeTokenForUserId(userId) – an async function that returns a string after creating a Token record
-	getUserIdFromToken(tokenString) – an async function that returns a userId string using the tokenString to get a token record
-	removeToken(tokenString) – an async function that deletes the corresponding token record

User

-	createUser(userData, userEmail) – should store a user record
-	getUser(email) – should get a user record using their email
-	getUserById(userId) - should get a user record using their id

Bnb

-	createItem(newItem) - should create a bnb record for the given user
-	getSearch(query) - should perform a text search through the vacation rentals in the database
-	getById(itemId) - should get a bnb record for itemId
-	getAll() - should get all bnbs
-	getByIdProject(itemId) - should get a bnb item for itemId and transforms the record
-	deleteItem(itemId) - should remove a bnb record

Cart

-	createItem(newItem) – should add a bnb to cart for the given user
-	getAll(userId) - should get all cart items for userId
-	deleteItem(itemId) - should remove bnb item from cart for itemId
-	getById(itemId) - should get a cart item for itemId
-	getByBnbId(bnbId) - should get a cart item for bnbId
-	getDuplicateItem(bnbId, userId) - should check if there is a duplicate cart item for bnbId and userId

## Models

-	User – fields: email, password and roles. A user's email should not appear more than once in the collection
-	Item – fields: city, cost, country, image, title, stars and userId
-	CartItem – fields: addedToCart, city, cost, country, bnbId, image, title, stars and userId
-	Token – fields: token and userId