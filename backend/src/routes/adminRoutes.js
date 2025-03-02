const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, superVerify } = require('../middleware/authMiddleware');

router.get('/users', protect, superVerify, adminController.getAllUsers);
router.get('/users/:id', protect, superVerify, adminController.getUser);
router.put('/users/:id', protect, superVerify, adminController.updateUser);
router.delete('/users/:id', protect, superVerify, adminController.deleteUser);

router.get('/transactions', protect, superVerify, adminController.getAllTransactions);
router.get('/transactions/:id', protect, superVerify, adminController.getTransaction);
router.delete('/transactions/:id', protect, superVerify, adminController.deleteTransaction);

router.get('/apikeys', protect, superVerify, adminController.getAllApiKeys);
router.get('/apikeys/:id', protect, superVerify, adminController.getApiKey);
router.delete('/apikeys/:id', protect, superVerify, adminController.deleteApiKey);

module.exports = router;