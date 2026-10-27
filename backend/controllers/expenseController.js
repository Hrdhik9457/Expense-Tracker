const Expense = require('../models/Expense');

async function getExpenses(req, res) {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json({ success: true, data: expenses });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function createExpense(req, res) {
  try {
    const { title, amount, category, date } = req.body;

    if (!title || !amount || !category || !date) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: 'Amount must be greater than zero' });
    }

    const expense = new Expense({
      title: title.trim(),
      amount: Number(amount),
      category: category,
      date: date
    });

    const saved = await expense.save();
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Failed to create expense' });
  }
}

async function updateExpense(req, res) {
  try {
    const { title, amount, category, date } = req.body;

    if (amount && Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: 'Amount must be greater than zero' });
    }

    const updated = await Expense.findByIdAndUpdate(
      req.params.id,
      {
        title: title,
        amount: Number(amount),
        category: category,
        date: date
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Failed to update expense' });
  }
}

async function deleteExpense(req, res) {
  try {
    const deleted = await Expense.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    res.json({ success: true, message: 'Expense deleted' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Failed to delete expense' });
  }
}

module.exports = {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense
};
