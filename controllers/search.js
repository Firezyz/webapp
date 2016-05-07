//var es = require('../proxy/search');
exports.index = function (req, res, next) {
    var q = req.query.q;
    q = encodeURIComponent(q);
    res.redirect('https://www.google.com.hk/#hl=zh-CN&q=site:cnodejs.org+' + q);
};

exports.search = function (q) {
    var q = req.query.q;
    q = encodeURIComponent(q);
}
