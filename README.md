# Blog-App-API

here is the documentation for the /api/login API:

Method: POST

URL: /api/login

Request Body:
JSON

{
  "username": "string",
  "password": "string"
}

Use code with caution. Learn more

Responses:
Code snippet

Status Code | Description
---------- | --------
200 OK | Login successful. A JSON object containing the JWT token will be returned.
401 Unauthorized | Invalid username or password.
404 Not Found | User not found.

Use code with caution. Learn more

Example Request:
Code snippet

POST /api/login

{
  "username": "johndoe",
  "password": "password123"
}

Use code with caution. Learn more

Example Response:

HTTP/1.1 200 OK
Content-Type: application/json

{
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNjA5NjI5MzU5LCJpYXQiOjE2MDk2MjgzNTksImp0aSI6IjEyMzQ1Njc4ODU5NzM4OTU4In0.----------------"
}

Notes:

    The username and password fields are required.
    The password field is hashed and compared to the stored hash in the database.
    If the username and password are valid, a JWT token will be returned.
    The JWT token can be used to authenticate subsequent requests to the API.
    The JWT token expires after 1 hour.
--------------------------------------------------    
here is the documentation for the /api/profile API:

Method: GET

URL: /api/profile

Authentication: Requires JWT token.

Responses:
Status Code	Description
200 OK	Profile page successfully loaded. A JSON object containing the message "Welcome to the profile page" will be returned.
401 Unauthorized	JWT token is invalid or expired.

Example Request:
Code snippet

GET /api/profile

Authorization: Bearer <JWT token>

Use code with caution. Learn more

Example Response:

HTTP/1.1 200 OK
Content-Type: application/json

{
"message": "Welcome to the profile page"
}

Notes:

    The Authorization header must be set with the JWT token.
    The JWT token can be obtained by calling the /api/login API.
    The JWT token expires after 1 hour.

--------------------------------------------------
  here is the documentation for the /api/home API:

Method: GET

URL: /api/home

Authentication: Requires JWT token.

Responses:
Status Code	Description
200 OK	Home page successfully loaded. A JSON object containing the message "Welcome to the home page" will be returned.
401 Unauthorized	JWT token is invalid or expired.

Example Request:
Code snippet

GET /api/home

Authorization: Bearer <JWT token>

Use code with caution. Learn more

Example Response:

HTTP/1.1 200 OK
Content-Type: application/json

{
"message": "Welcome to the home page"
}

Notes:

    The Authorization header must be set with the JWT token.
    The JWT token can be obtained by calling the /api/login API.
    The JWT token expires after 1 hour.
  
 --------------------------------------------------
   here is the documentation for the /api/register API:
  
  Method: POST

  URL: /api/register

  Authentication: Requires JWT token.
  
  app.post("/api/register")

Description: This function registers a new user.

Parameters:

    req: The request object.
    res: The response object.

Returns:

    A 201 Created response if the user was successfully registered, or a 400 Bad Request response if the request was invalid.

Example Usage:
JavaScript

const request = {
  username: "johndoe",
  password: "password123",
  email: "johndoe@example.com",
  city: "New York",
  about: "I'm a software engineer."
};

app.post("/api/register", (req, res) => {
  // Register the user.
});

Use code with caution. Learn more

Notes:

    This function uses the bcrypt module to hash the password before storing it in the database. This helps to protect the password from being cracked.
    This function also uses the jwt module to create a JWT token for the user. This token can be used to authenticate the user in future requests.

 --------------------------------------------------
   here is the documentation for the /api/allBlogs API:

Description: This code gets all the blogs from the database and returns them to the client.

Inputs and outputs:

    Inputs:
        req: The request object
        res: The response object
    Outputs:
        A JSON array of blogs

Steps involved in using the code:

    The code first calls the verifyToken() function to verify that the user has a valid token.
    If the user does not have a valid token, the code returns a 401 Unauthorized error.
    If the user has a valid token, the code calls the BlogsDB.find() method to get all the blogs from the database.
    The code then calls the populate() method to populate the blogs with their user information.
    Finally, the code calls the res.status(200).json(blogs) method to return the blogs to the client.

Known limitations of the code:

    The code does not handle errors gracefully. If an error occurs, the code simply logs the error to the console.
    The code does not support pagination.

How to improve the code:

    The code could be improved by handling errors gracefully. For example, the code could catch errors and return a 400 Bad Request error to the client.
    The code could also be improved by supporting pagination. This would allow the client to request a specific page of blogs.
