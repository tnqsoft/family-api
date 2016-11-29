var express = require('express'),
    _ = require('lodash'),
    router = express.Router(),
    jwtHelper = require('../helper/jwt');

var app = module.exports = express.Router();

var users = [{
    id: 1,
    username: 'test',
    password: 'test'
}, {
    id: 2,
    username: 'test2',
    password: 'test2'
}];

// -----------------------------------------------------------------------
// Authenticate
router.post('/authenticate', function(req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
    let remember = req.body.remember;

    if (username === '' || password === '') {
        return res.status(400).send({
            code: 400,
            message: "You must send the username and the password"
        });
    }

    var user = _.find(users, {
        username: username
    });

    if (!user) {
        return res.status(401).send({
            code: 401,
            message: "The username or password don't match"
        });
    }

    if ((user.password !== password)) {
        return res.status(401).send({
            code: 401,
            message: "The username or password don't match"
        });
    }

    res.status(200).send({
        token: jwtHelper.create(user, remember)
    });
});
// -----------------------------------------------------------------------
// Get User list
router.get('/api/user', function(req, res) {
  res.status(200).send(users);
});
// -----------------------------------------------------------------------

module.exports = router;
