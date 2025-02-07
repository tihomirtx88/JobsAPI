const express = require('express');
const router = express.Router();
const { register, login, updateUser } = require('../controllers/auth');
const { uploadUserImage } = require("../controllers/uploadsController");
const authenticateUser = require("./../middlewares/authentication");
const testUser = require("./../middlewares/testUser");

router.post('/register', register);
router.post('/login', login);
router.patch('/updateUser',authenticateUser, testUser, updateUser);
router.route('/uploads').post(uploadUserImage);

module.exports = router;