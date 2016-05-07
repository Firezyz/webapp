//var User = require('../proxy').User;
var utility = require('utility');
var util = require('util');
var tools = require('../common/tools');
var config = require('../config');
var validator = require('validator');
var utility = require('utility');

exports.index = function (req, res, next) {
    var user_name = req.params.name;

    User.getUserByLoginName(user_name, function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            res.render404('这个用户不存在。');
            return;
        }
        if (!user.is_webmaster && !user.is_admin) {
            res.render404('页面不存在');
            return;
        }

        var render = function () {
            if (user.is_webmaster) {
                identity = 'webmaster';
            } else if (user.is_admin) {
                identity = 'admin';
            }
            res.render('manage/index', {
                current_user: user,
                user_identity: identity,
                pageTitle: '管理页面'
            });
        };

    });
};

