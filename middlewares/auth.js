var mongoose = require('mongoose');
var UserModel = mongoose.model('User');
//var Message = require('../proxy').Message;
var config = require('../config');
var eventproxy = require('eventproxy');
var UserProxy = require('../proxy/user');

/**
 * 需要管理员权限
 */
exports.adminRequired = function (req, res, next) {
    if (!req.session.user) {
        return res.render('notify/notify', {error: '你还没有登录。'});
    }

    if (!req.session.user.is_admin) {
        return res.render('notify/notify', {error: '需要管理员权限。'});
    }

    next();
};

/**
 * 需要登录
 */
exports.userRequired = function (req, res, next) {
    if (!req.session || !req.session.user) {
        return res.status(403).send('forbidden!');
    }

    next();
};


/**
 * 需要版主权限
 * @param req
 * @param res
 * @param next
 */
exports.webmasterRequired = function (req, res, next) {
    if (!req.session.user) {
        return res.render('notify/notify', {error: '请先登录'})
    }
    if (req.session.user.is_admin) {
        next();
    }
    if (!req.session.user.is_webmaster) {
        return res.render('notify/notify', {error: '需要版主权限。'})
    }
    next();
};

exports.blockUser = function () {
    return function (req, res, next) {

        // 可以登出用户
        if (req.path === '/signout') {
            return next();
        }

        if (req.session.user && req.session.user.is_block && req.method !== 'GET') {
            return res.status(403).send('您已经被管理员屏蔽！请联系管理员解开屏蔽');
        }
        next();
    };
};

//exports.blockTopic= function (req, res, next) {
//        // 可以登出用户
//        if (req.path === '/signout') {
//            return next();
//        }
//
//        if (req.session.user && req.session.user.is_block && req.method !== 'GET') {
//            return res.status(403).send('该主题已经被管理员屏蔽！请联系管理员解开屏蔽');
//        }
//        next();
//};

exports.gen_session = function (user, res) {
    var auth_token = user._id + 'O(∩_∩)O'; // 以后可能会存储更多信息，用 O(∩_∩)O 来分隔
    var opts = {
        path: '/',
        maxAge: 1000 * 60 * 15 * 1 * 1,
        //maxAge: 1000 * 60 * 60 * 24 * 1,
        signed: true,
        httpOnly: true
    };
    res.cookie(config.auth_cookie_name, auth_token, opts); //cookie 有效期15分钟
};

// 验证用户是否登录
exports.authUser = function (req, res, next) {
    var ep = new eventproxy();
    ep.fail(next);

    // Ensure current_user always has defined.
    res.locals.current_user = null;

    if (config.debug && req.cookies['mock_user']) {
        var mockUser = JSON.parse(req.cookies['mock_user']);
        req.session.user = new UserModel(mockUser);
        if (mockUser.is_admin) {
            req.session.user.is_admin = true;
        }
        if (mockUser.is_webmaster) {
            req.session.user.is_webmaster = true;
        }
        return next();
    }

    ep.all('get_user', function (user) {
        if (!user) {
            return next();
        }
        user = res.locals.current_user = req.session.user = new UserModel(user);

        if (config.admins.hasOwnProperty(user.loginname)) {
            user.is_admin = true;
        }

        if (config.webmasters.hasOwnProperty(user.loginname)) {
            user.is_webmaster = true;
        }
        next();
        Message.getMessagesCount(user._id, ep.done(function (count) {
            user.messages_count = count;
            next();
        }));
    });

    if (req.session.user) {
        ep.emit('get_user', req.session.user);
    } else {
        var auth_token = req.signedCookies[config.auth_cookie_name];
        if (!auth_token) {
            return next();
        }

        var auth = auth_token.split('O(∩_∩)O');
        var user_id = auth[0];
        UserProxy.getUserById(user_id, ep.done('get_user'));
    }
};
