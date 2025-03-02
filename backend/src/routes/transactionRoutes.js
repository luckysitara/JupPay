const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, transactionController.createTransaction);
router.get('/:id', protect, transactionController.getTransaction);
router.get('/', protect, transactionController.getAllTransactions);
router.put('/:id', protect, transactionController.updateTransaction);
router.delete('/:id', protect, transactionController.deleteTransaction);

module.exports = router;