# AuthBack

Authentication backend built with Node.js, Express, and MongoDB. Implements secure user authentication using JWT access tokens and refresh tokens.

---

## Features
- User registration
- User login
- JWT-based authentication
- Access & refresh token flow
- Password hashing using bcrypt
- Protected routes via middleware
- RESTful API structure

---

## Tech Stack
- Node.js
- Express
- MongoDB
- JWT
- bcrypt

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|------|------|------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login user |
| POST | /api/auth/refresh | Refresh access token |

### Protected
| Method | Endpoint | Description |
|------|------|------|
| GET | /api/protected | Example protected route |

---

## Installation
```bash
git clone https://github.com/Tsaishashanth/authback.git
cd authback
npm install
```
Create a .env file 
```bash
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
```
Start the server 
```bash
npm run dev
```
