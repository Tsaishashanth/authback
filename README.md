# AuthBack

A **JWT-based authentication backend** built with **Node.js, Express, and MongoDB**, featuring secure user registration, login, refresh tokens, and protected routes. Includes **Swagger API documentation** and optional **Supabase integration**.

---

## 📌 Features
- User Registration & Login
- JWT Authentication (access & refresh tokens)
- Password Hashing with bcrypt
- Protected Routes via middleware
- RESTful API structure
- Swagger API Docs for easy testing
- Supabase integration (optional)

---

## 🛠 Tech Stack
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT
- bcrypt
- Swagger
- Supabase

---

## 📂 Project Structure
```
authback/
│── models/          # Mongoose models (User schema, etc.)
│── routes/          # Express routes (auth, protected, cart, etc.)
│── node_modules/    # Dependencies
│── server.js        # Entry point of the application
│── swagger.js       # Swagger configuration
│── supabase.js      # Supabase client setup
│── .env             # Environment variables
│── package.json     # Project metadata & dependencies
│── README.md        # Documentation

```
---

## 🔑 API Endpoints

### Auth Routes
| Method | Endpoint              | Description             |
|--------|-----------------------|-------------------------|
| POST   | `/api/auth/signup`    | Register a new user     |
| POST   | `/api/auth/login`     | Login user              |
| POST   | `/api/auth/logout`    | Logout user             |

### User Routes (Protected)
| Method | Endpoint                  | Description             |
|--------|---------------------------|-------------------------|
| GET    | `/api/user/userdetails`   | Get logged-in user info |
| PUT    | `/api/user/updateuser`    | Update user profile     |

### Product Routes
| Method | Endpoint                        | Description                  |
|--------|---------------------------------|------------------------------|
| GET    | `/api/getallproducts`           | List all products            |
| GET    | `/api/productsbycategory`       | Get product details          |
| POST   | `/api/createproduct`            | Add new product (admin only) |
| DELETE | `/api/deleteproduct`            | Delete product (admin only)  |

---
## ⚙️ Installation & Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/Tsaishashanth/authback.git
   cd authback
   ```
   
2. **Install the dependencies**
   ```bash
   npm install
   ```
   
3. **Create .env file**
   ```bash
   PORT=5000
   MONGO_URI=your_mongodb_connection
   JWT_SECRET=your_jwt_secret
   JWT_REFRESH_SECRET=your_refresh_secret
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   ```
   
4. **Run the server**
   ```bash
   npm run dev
   ```
