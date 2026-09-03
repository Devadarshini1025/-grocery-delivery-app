# Grocery Delivery App

MERN stack grocery delivery app (React, Node.js, Express, MongoDB).

## Project Structure
```
grocery-delivery-app/
├── backend/          # Express + MongoDB API
│   ├── config/        # DB connection
│   ├── controllers/   # Route logic
│   ├── middleware/    # Auth, error handling
│   ├── models/        # Mongoose schemas
│   ├── routes/        # API routes
│   ├── utils/         # Helpers
│   ├── .env.example
│   └── server.js
└── frontend/          # React app (added in a later step)
```

## Step 1 setup (backend)

1. Open the `backend` folder in VS Code.
2. Copy `.env.example` to `.env` and fill in your real values (MongoDB URI, JWT secret, etc).
3. Install dependencies:
   ```
   cd backend
   npm install
   ```
4. Make sure MongoDB is running (locally, or use a free MongoDB Atlas cluster and paste its connection string into `MONGO_URI`).
5. Start the dev server:
   ```
   npm run dev
   ```
6. Visit `http://localhost:5000/api/health` — you should see `{"status":"ok", ...}`.

More steps (models, auth, cart, payments, admin, frontend) will be added as we build them.
