# 🔐 Backend API – Authentication, Brands, Products & Blocking

A full backend system using **Node.js**, **Express**, **MongoDB**, and **JWT** with support for:

- User Auth (Access + Refresh tokens)
- Brand & Product Management
- User Blocking System
- Protected APIs

---

## 🚀 Tech Stack

- Node.js  
- Express.js  
- MongoDB (Mongoose)  
- JWT (Access + Refresh Tokens)  
- bcrypt.js (Password Hashing)  
- Multer (Image Uploads)  

---

## ⚙️ Environment Setup

Create `.env` file:
PORT=5000
MONGO_URI=mongodb://localhost:27017/sappotta
JWT_SECRET=d8cdb77a4e1c6b6b3d69d9b2488f7a30f9a5d19cfba6fa89a1b070f2
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
NODE_ENV=development

---

## Setup & Installation

1. Clone the Repository git clone

2. Install Dependencies npm install

3. Configure Environment Variables

4. Start the Server npm start Server will run on http://localhost:5000.

---

API Endpoints

🔐 Auth Routes (/api/auth)
Method | Endpoint | Description
POST | /register | Register a new user (with profile photo)
POST | /login | Login and receive access + refresh token
POST | /refresh-token | Get new access token using refresh token
POST | /logout | Logout and invalidate refresh token

👤 User Routes (/api/user)
Method | Endpoint | Description
PUT | /profile/:id | Update own profile
DELETE | /profile/:id | Delete own profile
POST | /block/:targetUserId | Block a user
POST | /unblock/:targetUserId | Unblock a user

🏷️ Brand Routes (/api/brand)
Method | Endpoint | Description
POST | /add-brand | Add a new brand (auth + logo upload)
GET | /list-brands | Get all available brands

📦 Product Routes (/api/product)
Method | Endpoint | Description
POST | /add-product | Add a product (auth + image upload)
GET | /list-products | View all products (with filters)
GET | /my-products | View own added products
PUT | /update/:id | Update own product
DELETE | /delete/:id | Delete own product

---

## Sample API Request & Response

Login User:
{
  "email": "pranav1@gmail.com",
  "password": "123456"
}
Response:
{
  "message": "Login successful",
  "user": {
    "_id": "661cd12ef8434c3b8bc8e445",
    "username": "john_doe",
    "email": "john@example.com",
    "profilePhoto": "uploads/profilePhotos/1713348431871.jpg"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
}

For more sample requests & responses, check the Postman collection given in the Repo.
