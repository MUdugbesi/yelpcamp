const express = require('express');
const router = express.Router();
const users = require('../Controller/user')
const { storeReturnTo } = require('../middlewares/storeReturnTo')

const wrapAsync = require('../Errors/wrapAsync');
const passport = require('passport');

const { isLoggedIn } = require('../middlewares/login');


router.route('/register')
    .get(users.registerForm)
    .post(wrapAsync(users.registerUser));

router.route('/login')
    .get(users.loginForm)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.loginUser);

router.get('/logout', isLoggedIn, users.logoutUser);

module.exports = router;