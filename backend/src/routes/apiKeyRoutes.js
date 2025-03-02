const express = require('express');
const router = express.Router();
const apiKeyController = require('../controllers/apiKeyController');
const { protect, superVerify } = require('../middleware/authMiddleware');

router.post('/', protect, superVerify, apiKeyController.createApiKey);
router.get('/:id', protect, superVerify, apiKeyController.getApiKey);
router.get('/', protect, superVerify, apiKeyController.getAllApiKeys);
router.delete('/:id', protect, superVerify, apiKeyController.deleteApiKey);

module.exports = router;