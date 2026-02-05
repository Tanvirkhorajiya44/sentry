const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');

router.get('/stock', reportsController.stockReport);
router.get('/sales', reportsController.salesReport);
router.get('/purchase', reportsController.purchaseReport);
router.get('/profitloss', reportsController.profitLossReport);

module.exports = router;
