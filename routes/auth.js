const express = require('express');
const router = express.Router();
const { register, login, updateUser } = require('../controllers/auth');
const authenticateUser = require("./../middlewares/authentication");
const testUser = require("./../middlewares/testUser");

router.post('/register', register);
router.post('/login', login);
router.patch('/updateUser',authenticateUser, testUser, updateUser);

module.exports = router;