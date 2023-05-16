# OwisBukhari-W03-D01-HW

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
