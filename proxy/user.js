var utility = require('utility');
var uuid = require('node-uuid');
var tools = require('../common/tools');

var Bmob = require("bmob").Bmob;
//初始化，第一个参数是Application_id，第二个参数是REST API Key
Bmob.initialize("4899a0aadc762a1813a1aa7cdd758037", "8bffb9cf405880dfa4333f8b059e8e14");


///**
// * 根据用户名列表查找用户列表
// * Callback:
// * - err, 数据库异常
// * - users, 用户列表
// * @param {Array} names 用户名列表
// * @param {Function} callback 回调函数
// */
//exports.getUsersByNames = function (names, callback) {
//    if (names.length === 0) {
//        return callback(null, []);
//    }
//    User.find({loginname: {$in: names}}, callback);
//};

/**
 * 根据登录名查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} loginName 登录名
 * @param {Function} callback 回调函数
 */
exports.getUserByName = function (username, callback) {
    var User = Bmob.Object.extend("user");
    var query = new Bmob.Query(User);
    query.equalTo("username", username);
    // 查询所有数据
    query.first({
        success: function (user) {
            callback(tools.getObjAttr(user));
        },
        error: function (error) {
            alert("查询失败: " + error.code + " " + error.message);
        }
    });
};

exports.getNameById = function (id, callback) {
    var User = Bmob.Object.extend("user");
    var query = new Bmob.Query(User);
    query.select("nickname", "username");
    // 查询所有数据
    query.get(id, {
        success: function (result) {
            callback(tools.getObjAttr(result));
        },
        error: function (object, error) {
            alert(error);
        }
    })
}

/**
 * 根据用户ID，查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} id 用户ID
 * @param {Function} callback 回调函数
 */
exports.getUserById = function (id, callback) {
    if (!id) {
        return callback();
    }
    var User = Bmob.Object.extend("user");
    var query = new Bmob.Query(User);
    query.get(id, {
        success: function (user) {
            callback(tools.getObjAttr(user));
        },
        error: function (object, error) {
            alert(error);
        }
    })
};

/**
 * 根据邮箱，查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} email 邮箱地址
 * @param {Function} callback 回调函数
 */
exports.getUserByMail = function (email, callback) {
    var User = Bmob.Object.extend("user");
    var query = new Bmob.Query(User);
    query.equalTo("email", email);
    // 查询所有数据
    query.first({
        success: function (result) {
            callback(tools.getObjAttr(result));
        },
        error: function (error) {
            alert("查询失败: " + error.code + " " + error.message);
        }
    });
};

exports.isUsernameOrEmailExist = function (loginname, email, callback) {
    //初始化，第一个参数是Application_id，第二个参数是REST API Key
    var User = Bmob.Object.extend("user");
    var emailQ = new Bmob.Query(User);
    var usernameQ = new Bmob.Query(User);
    usernameQ.equalTo("username", loginname);
    emailQ.equalTo("email", email);

    var mainQuery = Bmob.Query.or(usernameQ, emailQ);
    mainQuery.find({
        success: callback,
        error: function (error) {
            alert("查询失败: " + error.code + " " + error.message);
        }
    });

}

///**
// * 根据用户ID列表，获取一组用户
// * Callback:
// * - err, 数据库异常
// * - users, 用户列表
// * @param {Array} ids 用户ID列表
// * @param {Function} callback 回调函数
// */
//exports.getUsersByIds = function (ids, callback) {
//    User.find({'_id': {'$in': ids}}, callback);
//};

///**
// * 根据关键字，获取一组用户
// * Callback:
// * - err, 数据库异常
// * - users, 用户列表
// * @param {String} query 关键字
// * @param {Object} opt 选项
// * @param {Function} callback 回调函数
// */
//exports.getUsersByQuery = function (query, opt, callback) {
//    User.find(query, '', opt, callback);
//};

///**
// * 根据查询条件，获取一个用户
// * Callback:
// * - err, 数据库异常
// * - user, 用户
// * @param {String} name 用户名
// * @param {String} key 激活码
// * @param {Function} callback 回调函数
// */
//exports.getUserByNameAndKey = function (loginname, key, callback) {
//    User.findOne({loginname: loginname, retrieve_key: key}, callback);
//};

exports.newAndSave = function (username, pass, email, callback) {
    var User = Bmob.Object.extend("user");
    var user = new User();
    user.save({
        username: username,
        password: pass,
        email: email,
        score: 0,
    }, {
        success: function (gameScore) {
        },
        error: function (gameScore, error) {
            callback(error);
        }
    });
};

//exports.getGravatar = function (user) {
//    return user.avatar;
//};
