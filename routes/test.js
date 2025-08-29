const { signUp, testing, getUsers} = require("../controllers/test");
const router = require('express').Router()


router.route('/hehe').get(testing)
router.route('/signUp').post(signUp)
router.route('/getUsers').get(getUsers)

module.exports = router