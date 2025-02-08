const express = require('express');
const router = express.Router();
const { register, login, updateUser } = require('../controllers/auth');
const { uploadUserImage, uploadImageWithCloudynary } = require("../controllers/uploadsController");
const authenticateUser = require("./../middlewares/authentication");
const testUser = require("./../middlewares/testUser");

router.post('/register', register);
router.post('/login', login);
router.patch('/updateUser',authenticateUser, testUser, updateUser);
router.route('/uploads').post(uploadImageWithCloudynary);

module.exports = router;