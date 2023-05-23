## Vacation rentals back-end project

## Technical components

# Routes

Login

-	Signup: POST /login/signup – use bcrypt on the incoming password. Store user with their email and encrypted password, handle conflicts when the email is already in use
-	Login: POST /login – find the user with the provided email. Use bcrypt to compare stored password with the incoming password. If they match, generate a random token with uuid and return it to the user.
-	Logout: POST /login/logout – If the user is logged in, invalidate their token so they can't use it again

Bnbs (requires authentication)

-	Get all bnbs: GET /bnbs (doesn’t require authentication)
-	Get specific bnb: GET /bnbs/:id (doesn’t require authentication)
-	Search bnbs: GET /bnbs/search
-	Create a bnb record: POST /bnbs
-	Remove a bnb record: DELETE /bnbs/:id – regular users can only delete their own records. Users with the "admin" role can remove any record

Vacation rentals cart (requires authentication)

-	Get all items in the cart for a particular user: GET /cart
-	Add a record to the cart for a particular user: POST /cart
-	Remove a record from the cart for a particular user: DELETE /cart/:id

# Middleware

-	isLoggedIn(req, res, next) – should check if the user has a valid token
-	isAdmin – if the user making the request is not an admin it should respond with a 403 Forbidden error

# DAOs

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

# Models

-	User – fields: email and password. A user's email should not appear more than once in the collection
-	Bnb – fields: city, cost, country, image, title and userId
-	Token – fields: token and userId