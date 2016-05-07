var bcrypt = require('bcryptjs');
var moment = require('moment');

moment.locale('zh-cn'); // 使用中文

// 格式化时间
exports.formatDate = function (date, friendly) {
    date = moment(date);

    if (friendly) {
        return date.fromNow();
    } else {
        return date.format('YYYY-MM-DD HH:mm');
    }

};

exports.getObjAttr = function (obj) {
    return getValueFromBmob(obj);
}

function getValueFromBmob(obj) {
    if ("attributes" in obj) {
        objNew = obj.attributes;
        objNew._id = obj.id;
        objNew.createdAt = obj.createdAt;
        objNew.updatedAt = obj.updatedAt;
        return objNew;
    }
    return undefined;
}

exports.getObjListAttr = function (list) {
    new_list = [];
    list.forEach(function (obj) {
        new_list.push(getValueFromBmob(obj));
    })
    return new_list;

}

exports.validateId = function (str) {
    return (/^[a-zA-Z0-9\-_]+$/i).test(str);
};

exports.bcrypt_hash = function (str, callback) {
    bcrypt.hash(str, 10, callback);
};

exports.bcrypt_compare = function (str, hash, callback) {
    bcrypt.compare(str, hash, callback);
};
