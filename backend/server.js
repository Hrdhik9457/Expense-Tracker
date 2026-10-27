const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const expenseRoutes = require('./routes/expenseRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/expenses', expenseRoutes);

app.get('/', function(req, res) {
  res.send('Expense Tracker API is running');
});

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
  .then(function() {
    console.log('Connected to MongoDB Atlas');
    app.listen(PORT, function() {
      console.log('Server running on port ' + PORT);
    });
  })
  .catch(function(err) {
    console.log('Database connection error:', err);
  });
