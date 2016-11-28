var express = require('express'),
    _ = require('lodash'),
    configs = require('../configs'),
    jwt = require('jsonwebtoken');

var jwtHelper = {
    create: function(user, remember) {
        let expiresTime = 60 * 24; // 1 day
        if (remember === true) {
            expiresTime = expiresTime * 30; // 1 month
        }
        return jwt.sign(_.omit(user, 'password'), configs.secret, {
            expiresInMinutes: expiresTime
        });
    }
};

module.exports = jwtHelper;
