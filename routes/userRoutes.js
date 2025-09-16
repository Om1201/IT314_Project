const { signUp, testing, getUsers, login, refresh, logout } = require("../controllers/userAuth");
const router = require('express').Router();
const { verifyToken } = require('../middlewares/authMiddleware');

router.route('/hehe').get(testing);
router.route('/signUp').post(signUp);
router.route('/login').post(login);

// Refresh & logout
router.route('/refresh').post(refresh);
router.route('/logout').post(logout);

// Protected route
router.route('/getUsers').get(verifyToken, getUsers);

module.exports = router;
