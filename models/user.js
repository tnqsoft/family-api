var condb = require('../helpers/db'),
    Promise = require('promise');

var tableName = 'tbl_user';

var userModel = {
    tableName: 'tbl_user',
    list: function() {
        var _this = this;
        return new Promise(function(resolve, reject) {
            condb.query('SELECT * FROM ' + _this.tableName,
                function(err, rows, fields) {
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                });
        });
    },
    findByUsername: function(username) {
        var _this = this;
        return new Promise(function(resolve, reject) {
            condb.query('SELECT * FROM ' + _this.tableName + ' WHERE username = ? LIMIT 0,1',
                [username],
                function(err, rows, fields) {
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                });
        });
    }
};

module.exports = userModel;
