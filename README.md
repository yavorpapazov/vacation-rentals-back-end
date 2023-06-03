# Vacation rentals back-end project

Work still needs to be done:

-	Bnbs search route
-	Test files
-	I would like to complete my front-end app for testing and demonstration as well

Everything else below has been completed.

# Project description

The purpose of this application is to create, display and remove vacation rental records. It provides routes for signup, login and logout. Regular users are able to create a record, retrieve any record and remove their own items. Admin users are able create, retrieve and remove any record. This will be handled by a simple authorization. All users are able to add items to their vacation rentals cart, as well as display and remove them from there. All users can search through the vacation rentals in the database.

The application will use the bcrypt library for securely storing passwords. Only authenticated users can access the protected API routes. Additionally, authentication is handled by generating random tokens with the use of the uuid library.

# Technical components

## Routes

Login

-	Signup: POST /login/signup – use bcrypt on the incoming password. Store user with their email and encrypted password, handle conflicts when the email is already in use
-	Login: POST /login – find the user with the provided email. Use bcrypt to compare stored password with the incoming password. If they match, generate a random token with uuid and return it to the user
-	Logout: POST /login/logout – If the user is logged in, invalidate their token so they can't use it again

Bnbs (requires authentication)

-	Get all bnbs: GET /bnbs (doesn’t require authentication)
-	Get specific bnb: GET /bnbs/:id (doesn’t require authentication)
-	Search bnbs: GET /bnbs/search
-	Create a bnb record: POST /bnbs
-	Remove a bnb record: DELETE /bnbs/:id – regular users can only delete their own records. Users with the "admin" role can remove any record. A record can be removed only if it is not in the user’s cart

Vacation rentals cart (requires authentication)

-	Get all items in the cart for a particular user: GET /cart
-	Add a record to the cart for a particular user: POST /cart
-	Remove a record from the cart for a particular user: DELETE /cart/:id

## Middleware

-	isLoggedIn(req, res, next) – should check if the user has a valid token
-	isAdmin – if the user making the request is not an admin it should respond with a 403 Forbidden error

## DAOs

Token

-	makeTokenForUserId(userId) – an async function that returns a string after creating a Token record
-	getUserIdFromToken(tokenString) – an async function that returns a userId string using the tokenString to get a token record
-	removeToken(tokenString) – an async function that deletes the corresponding token record

User

-	createUser(userObj) – should store a user record
-	getUser(email) – should get a user record using their email

Bnb

-	createBnb(userId, bnbObj) – should create a bnb record for the given user
-	getBnb(bnbId) - should get a bnb record for bnbId
-	getAllBnbs() - should get all bnbs

Cart

-	addToCart(userId, bnbObj) – should add a bnb to cart for the given user
-	getCart(userId) - should get all cart items for userId
-	removeFromCart(userId, bnbId) - should remove bnb item from cart for userId and bnbId

## Models

-	User – fields: email and password. A user's email should not appear more than once in the collection
-	Bnb – fields: city, cost, country, image, title and userId
-	Cart – fields: city, cost, country, image, title and userId
-	Token – fields: token and userId

## Implementation plan

-	Week May 22 – work on back-end application
-	Week May 29 – work on back-end application
-	Week June 5 – complete back-end project and front-end application used for testing and demonstration
-	Week June 12 – work on testing files