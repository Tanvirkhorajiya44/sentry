const express = require('express');
const router = express.Router();
const expensesController = require('../controllers/expensesController');

router.post('/add', expensesController.addExpense);
router.get('/cashflow', expensesController.getCashFlow);

module.exports = router;
