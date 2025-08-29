const { dene, testing, getUsers} = require("../controllers/test");
const router = require('express').Router()


router.route('/hehe').get(testing)
router.route('/dene').post(dene)
router.route('/getAll').get(getUsers)

module.exports = router