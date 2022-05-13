const express = require('express');
const router = new express.Router();
const ExpressError = require("../expressError")
const db = require('../db')
const User = require('../models/user')




/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body
        const results = await User.authenticate(username, password);
        return res.json({message: 'LOGGEDIN!', token:results});
    } catch (e) {
        return next(e)
    }
})




router.post('/register', async (req, res, next) => {
    try {
        const {username, password, first_name, last_name, phone} = req.body
        
        const registerUser = await User.register(username, password,
            first_name, last_name, phone)
        
        return res.json(registerUser)
    } catch (e) {
        if (e.code === '23505') {
            return next(new ExpressError('Username already taken, please pick another', 400));
        }
        return next(e)
    }
})

module.exports = router