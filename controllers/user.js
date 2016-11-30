var express = require('express'),
    _ = require('lodash'),
    router = express.Router(),
    jwtHelper = require('../helpers/jwt'),
    userModel = require('../models/user');

// var users = [{
//     id: 1,
//     username: 'test',
//     password: 'test'
// }, {
//     id: 2,
//     username: 'test2',
//     password: 'test2'
// }];
// var user = _.find(users, {
//     username: username
// });

// -----------------------------------------------------------------------
/**
 * @apiDefine UserModel
 * @apiSuccess {number} id User indentity.
 * @apiSuccess {string} username Username.
 * @apiSuccess {string} password Password.
 * @apiSuccess {string} email Email.
 * @apiSuccess {number} is_active User status.
 * @apiSuccess {datetime} created_at Created at.
 * @apiSuccess {datetime} updated_at Updated at.
 */

/**
 * @api {get} /api/user Get User list
 * @apiName GetUserList
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiPermission Member
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Content-Type": "application/json",
 *       "Authorization": "Bearer TokenString"
 *     }
 *
 * @apiUse UserModel
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [{
 *       "id": 1,
 *       "username": "test",
 *       "password": "test",
 *       "email": "tuanquynh0508@gmail.com",
 *       "is_active": 1,
 *       "created_at": "2016-11-30T02:29:47.000Z",
 *       "updated_at": "2016-11-30T02:29:47.000Z"
 *     }]
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "code": 401,
 *       "message": "Failed to authenticate token."
 *     }
 */
router.get('/', function(req, res) {
    userModel.list().then(function(rows) {
      res.status(200).send(rows);
    });
});
// -----------------------------------------------------------------------

module.exports = router;
