const express = require('express');
const router = express.Router();
const { register, login, updateUser } = require('../controllers/auth');
const authenticateUser = require("./../middlewares/authentication");
router.post('/register', register);
router.post('/login', login);
router.patch('/updateUser',authenticateUser, updateUser);

module.exports = router;