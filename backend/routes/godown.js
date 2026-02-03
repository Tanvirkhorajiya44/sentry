const express = require('express');
const router = express.Router();
const godownController = require('../controllers/godownController');

router.post('/add', godownController.addLocation);
router.get('/list', godownController.listLocations);
router.get('/stock', godownController.getGodownStock);
router.get('/transactions', godownController.getGodownTransactions);

module.exports = router;
