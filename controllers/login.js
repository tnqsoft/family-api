var express = require('express'),
    _ = require('lodash'),
    router = express.Router(),
    jwtHelper = require('../helpers/jwt'),
    userModel = require('../models/user');

// -----------------------------------------------------------------------
/**
 * @api {post} /authenticate User login
 * @apiName UserLogin
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiPermission Anonymous
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Content-Type": "application/json"
 *     }
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "username": "test",
 *       "password": "test"
 *     }
 *
 * @apiSuccess {String} token Token key.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "token": "Token key string"
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "code": 404,
 *       "message": "User not found."
 *     }
 *
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "code": 400,
 *       "message": "You must send the username and the password."
 *     }
 *
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "code": 401,
 *       "message": "The username or password don't match."
 *     }
 */
router.post('/authenticate', function(req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
    let remember = req.body.remember;

    if (username === '' || password === '') {
        return res.status(400).send({
            code: 400,
            message: "You must send the username and the password."
        });
    }

    userModel.findByUsername(username).then(function(rows) {
      if(rows.length === 0) {
        return res.status(404).send({
            code: 404,
            message: "User not found."
        });
      }

      var user = rows[0];

      if ((user.password !== password)) {
          return res.status(401).send({
              code: 401,
              message: "The username or password don't match."
          });
      }

      res.status(200).send({
          token: jwtHelper.create(user, remember)
      });
    });
});
// -----------------------------------------------------------------------

module.exports = router;
