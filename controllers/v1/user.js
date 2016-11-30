var express = require('express'),
    _ = require('lodash'),
    router = express.Router(),
    jwtHelper = require('../../helpers/jwt'),
    utitlity = require('../../helpers/utility'),
    userModel = require('../../models/user'),
    util = require('util');

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
 * @api {get} /api/v1/user Get User list
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

/**
 * @api {post} /api/v1/user Create User list
 * @apiName CreateUserList
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
 *     {
 *       "id": 1,
 *       "username": "test",
 *       "password": "test",
 *       "email": "tuanquynh0508@gmail.com",
 *       "is_active": 1,
 *       "created_at": "2016-11-30T02:29:47.000Z",
 *       "updated_at": "2016-11-30T02:29:47.000Z"
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "code": 401,
 *       "message": "Failed to authenticate token."
 *     }
 */
router.post('/', function(req, res) {
    // Validator input
    req.checkBody('username', 'Invalid username').notEmpty();
    req.checkBody('password', 'Invalid password').notEmpty();
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('is_active', 'Invalid is_active').notEmpty().isBoolean();

    let user = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        is_active: req.body.is_active,
        created_at: utitlity.getNow()
    }

    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            return res.status(400).send({
                code: 400,
                message: util.inspect(result.array())
            });
        }

        userModel.create(user).then(function(rows) {
            res.status(201).send(rows);
        });
    });
});

router.put('/:id', function(req, res) {

    // Validator input
    req.checkBody('username', 'Invalid username').notEmpty();
    req.checkBody('password', 'Invalid password').notEmpty();
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('is_active', 'Invalid is_active').notEmpty().isBoolean();

    let user = {
        id: parseInt(req.params.id, 10),
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        is_active: req.body.is_active,
        updated_at: utitlity.getNow()
    }

    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            return res.status(400).send({
                code: 400,
                message: util.inspect(result.array())
            });
        }

        userModel.update(user).then(function(rows) {
            res.status(200).send(rows);
        });
    });
});

router.delete('/:id', function(req, res) {
    let id = parseInt(req.params.id, 10);
    userModel.delete(id).then(function(rows) {
        res.status(200).send({
            code: 200,
            message: 'Deleted ' + rows.affectedRows + ' records.'
        });
    });
});
// -----------------------------------------------------------------------

module.exports = router;
