# Personal Expense Tracker (MERN Stack)

A full-stack Personal Expense Tracker built with MongoDB, Express.js, React.js, and Node.js.

## Project Structure

```
expense-tracker/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── App.js
│   │   ├── index.css
│   │   └── index.js
│   └── package.json
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── .env
│   └── package.json
├── .env
└── README.md
```

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
npm start
```

The backend server runs on http://localhost:5000 and connects to MongoDB Atlas.

### 2. Frontend Setup

Open a separate terminal:

```bash
cd frontend
npm install
npm start
```

The React frontend runs on http://localhost:3000.

## Environment Variables

The `.env` file is included in both `/backend/.env` and the root folder for evaluation:

```env
PORT=5000
MONGO_URI=mongodb://hrdhik225923_db_user:Hrdhik9457@ac-teaeiun-shard-00-00.komnezc.mongodb.net:27017,ac-teaeiun-shard-00-01.komnezc.mongodb.net:27017,ac-teaeiun-shard-00-02.komnezc.mongodb.net:27017/expensetracker?ssl=true&replicaSet=atlas-htsh73-shard-0&authSource=admin&retryWrites=true&w=majority
```

Note: These are test credentials created for this evaluation on a free-tier MongoDB Atlas cluster.

## API Endpoints

- GET /api/expenses - Retrieve all expenses
- POST /api/expenses - Add a new expense
- PUT /api/expenses/:id - Update an expense by id
- DELETE /api/expenses/:id - Remove an expense by id

## Implemented Features

- Add Expense: Form with Title, Amount, Category (Food, Travel, Bills, Shopping, Other), and Date. Input validation prevents blank or negative amounts.
- View Expenses: Live table view displaying title, amount, category, and date. Automatically refreshes after every add, edit, or delete action.
- Edit Expense: Pre-fills existing expense data in the form and updates records in MongoDB and on-screen.
- Delete Expense: Removes item with confirmation modal dialog before deleting.
- Summary: Total Amount Spent displayed at the top, recalculating dynamically on every change.
- Responsive Design: Clean CSS interface adapted for mobile and desktop screens.
