const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect, superVerify, subAdminVerify } = require('../middleware/authMiddleware');
const { validateSignup, validateLogin } = require('../middleware/validators');

router.post('/signup', validateSignup, authController.signup);
router.post('/login', validateLogin, authController.login);
router.get('/get_all_users', protect, superVerify, authController.getAllUsers);
router.get('/get_user/:id', protect, authController.getUser);
router.delete('/delete_user/:id', protect, superVerify, authController.deleteUser);
router.post('/admin_get_users_list', protect, subAdminVerify, authController.adminGetUsersList);
router.post('/forgotpassword', authController.forgotPassword);
router.put('/resetpassword/:token', authController.resetPassword);
router.post('/verifyemail', authController.verifyEmail);
router.put('/verifycode/:code', authController.verifyCode);

module.exports = router;