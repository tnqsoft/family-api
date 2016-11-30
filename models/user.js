var condb = require('../helpers/db'),
    Promise = require('promise');

var tableName = 'tbl_user';

var userModel = {
    tableName: 'tbl_user',
    list: function() {
        var _this = this;
        var sql = 'SELECT * FROM ' + _this.tableName;
        return new Promise(function(resolve, reject) {
            condb.query(sql,
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
        var sql = 'SELECT * FROM ' + _this.tableName + ' WHERE username = :username LIMIT 0,1';
        return new Promise(function(resolve, reject) {
            condb.query(sql, {username: username},
                function(err, rows, fields) {
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                });
        });
    },
    findById: function(id) {
        var _this = this;
        var sql = 'SELECT * FROM ' + this.tableName + ' WHERE id = :id LIMIT 0,1';
        return new Promise(function(resolve, reject) {
            condb.query(sql, {id: id},
                function(err, rows, fields) {
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                });
        });
    },
    create: function(user) {
        var _this = this;
        var sql = 'INSERT INTO ' + _this.tableName + ' SET username = :username, password = :password, email = :email, is_active = :is_active, created_at = :created_at';
        return new Promise(function(resolve, reject) {
            var query = condb.query(sql, user,
                function(err, rows, fields) {
                    if (err) {
                        reject(err);
                    }
                    return _this.findById(rows.insertId).then(function(rows) {
                        resolve(rows[0]);
                    }, function(err) {
                        reject(err);
                    });
                });
            //console.log(query.sql);
        });
    },
    update: function(user) {
        var _this = this;
        var sql = 'UPDATE ' + _this.tableName + ' SET username = :username, password = :password, email = :email, is_active = :is_active, updated_at = :updated_at  WHERE id = :id';
        return new Promise(function(resolve, reject) {
            var query = condb.query(sql, user,
                function(err, rows, fields) {
                    if (err) {
                        reject(err);
                    }
                    return _this.findById(user.id).then(function(rows) {
                        resolve(rows[0]);
                    }, function(err) {
                        reject(err);
                    });
                });
            //console.log(query.sql);
        });
    },
    delete: function(id) {
        var _this = this;
        var sql = 'DELETE FROM ' + _this.tableName + ' WHERE id = :id';
        return new Promise(function(resolve, reject) {
            var query = condb.query(sql, {id: id},
                function(err, rows, fields) {
                    if (err) {
                        reject(err);
                    }

                    resolve(rows);
                });
            //console.log(query.sql);
        });
    }
};

module.exports = userModel;
