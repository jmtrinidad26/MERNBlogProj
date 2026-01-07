# MERNBlogProj

A full-stack MERN (MongoDB, Express, React, Node.js) blog application.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB Atlas account (or local MongoDB instance)

## Project Structure

```
MERNBlogProj/
├── backend/          # Express.js backend server
├── frontend/         # React frontend application
└── README.md
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. The `.env` file is already configured with the necessary environment variables:
   - `ATLAS_URI` - MongoDB connection string
   - `PORT` - Server port (default: 3000)
   - `SECRETKEY` - JWT secret key

4. Start the backend server:
   ```bash
   npm start
   ```

   The server will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will typically run on `http://localhost:5173` (Vite default port)

## Running the Project

### Option 1: Run Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Option 2: Using PowerShell (Windows)

**Backend:**
```powershell
cd backend; npm start
```

**Frontend (in a new terminal):**
```powershell
cd frontend; npm run dev
```

## Environment Variables

The backend uses a `.env` file located in the `backend/` directory with the following variables:

- `ATLAS_URI` - MongoDB Atlas connection string
- `PORT` - Backend server port
- `SECRETKEY` - JWT secret key for authentication

**Note:** The `.env` file is already configured. If you need to update it, edit `backend/.env`.

## Features

- User authentication (JWT)
- Create, read, update, and delete blog posts
- User profiles
- Protected routes

## API Endpoints

### Posts
- `GET /posts` - Get all posts (requires authentication)
- `GET /posts/:id` - Get a single post (requires authentication)
- `POST /posts` - Create a new post (requires authentication)
- `PUT /posts/:id` - Update a post (requires authentication)
- `DELETE /posts/:id` - Delete a post (requires authentication)

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get a single user
- `POST /users` - Create a new user
- `PUT /users/:id` - Update a user
- `DELETE /users/:id` - Delete a user
- `POST /users/login` - User login

## Troubleshooting

1. **Backend won't start:**
   - Ensure MongoDB Atlas connection string is correct in `.env`
   - Check if port 3000 is available
   - Verify all dependencies are installed: `npm install`

2. **Frontend won't start:**
   - Ensure all dependencies are installed: `npm install`
   - Check if the backend server is running on port 3000
   - Verify the API URL in `frontend/src/api.js` matches your backend URL

3. **Connection errors:**
   - Verify MongoDB Atlas connection string
   - Check network connectivity
   - Ensure MongoDB Atlas IP whitelist includes your IP address
