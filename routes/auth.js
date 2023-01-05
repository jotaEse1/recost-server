const express = require('express');
const router = express.Router()
//validators
const {signinValidator, loginValidator} = require('../validator/validator')
//controllers
const {signIn, logIn, checkToken, logOut} = require('../controllers/auth')

//routes
router.route('/signin').post(signinValidator, signIn)
router.route('/login').post(loginValidator, logIn)
router.route('/refresh_token').post(checkToken)
router.route('/logout').post(logOut)


module.exports = router