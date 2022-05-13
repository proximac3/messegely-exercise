const express = require('express');
const router = new express.Router();
const ExpressError = require("../expressError")
const db = require('../db')
const User = require('../models/user')


// GET / - get list of users.
router.get('/', async (req, res, next) => {
    try {
        const users = await User.all()
        return res.json({users: users})
    } catch (e) {
        return next(e)
    }
});



//GET /:username - get detail of users.
router.get('/:username', async (req, res, next) => {
    try {
        // get use from db
        const user = await User.get(req.params.username)
        return res.json(user)
    } catch (e) {
        return next(e)
    }
});


/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/


/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

module.exports = router;