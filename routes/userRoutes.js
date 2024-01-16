const express = require('express');
const userController = require('../controllers/userController')

const router = express.Router();
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/verify', userController.verify);
router.put('/update/:id', userController.edit);
router.get('/find/:id', userController.findID);
router.get('/health', userController.getHealth);
module.exports = router;
