# Northstar — MERN Sign Up

A full-stack sign-up application built with **MongoDB, Express.js, React, and Node.js**. The interface uses a responsive split-screen layout with a dark editorial-style welcome panel and a clean account creation form.

## Project Description

This lab project demonstrates a user registration workflow. A visitor enters their name, email address, password, and password confirmation. React validates the form and sends the registration details to an Express REST API. The API validates the request, checks for an existing account, hashes the password with bcrypt, and stores the new user in MongoDB.

## Features

- Responsive and distinctive sign-up UI.
- Name, email, password, and confirm-password fields.
- Show/hide password controls.
- Client-side password match and minimum-length checks.
- REST API validation and duplicate-email handling.
- Password hashing with bcrypt (12 salt rounds); plain-text passwords are never stored.
- MongoDB persistence using Mongoose.
- Success and error feedback in the UI.
- Health-check endpoint for testing the API.

## Tech Stack

- **Frontend:** React, Vite, CSS, Lucide React
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Security:** bcryptjs password hashing

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Checks whether the API is running |
| POST | `/api/auth/signup` | Validates and creates a new user |

### POST `/api/auth/signup`

Request body:

```json
{
  "name": "Alex Morgan",
  "email": "alex@example.com",
  "password": "securepass123"
}
```

Success response (`201 Created`):

```json
{
  "message": "Your account has been created successfully.",
  "user": {
    "id": "<mongo-generated-id>",
    "name": "Alex Morgan",
    "email": "alex@example.com"
  }
}
```

Possible error status codes: `400` for invalid or missing fields, `409` if the email is already registered, and `500` for an unexpected server error.

## Installation & Usage

### Prerequisites

- Node.js 18 or later and npm
- MongoDB running locally, or a MongoDB Atlas connection string

### 1. Configure the backend

```bash
cd server
cp .env.example .env
```

Update `MONGODB_URI` in `server/.env` if you are using MongoDB Atlas. The default URI connects to a local database named `mern_signup_lab`.

### 2. Install dependencies

From the project root:

```bash
npm run install:all
```

### 3. Start the application

Make sure MongoDB is running. From the project root, run:

```bash
npm run dev
```

- React frontend: `http://localhost:5173`
- Express API: `http://localhost:5003`
- API health check: `http://localhost:5003/api/health`

### Run frontend and backend separately

Terminal 1:

```bash
cd server
npm install
npm run dev
```

Terminal 2:

```bash
cd client
npm install
npm run dev
```

## Folder Structure

```text
mern-signup-lab/
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   └── package.json
├── server/
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── auth.js
│   ├── .env
│   ├── .env.example
│   ├── index.js
│   └── package.json
├── .gitignore
├── package.json
└── README.md
```

## Notes

- Do not commit your `.env` file or expose your MongoDB credentials.
- The password is hashed before it is saved to the database.
- This lab implements registration only. Login, email verification, password reset, and session/JWT authentication can be added as separate features.
