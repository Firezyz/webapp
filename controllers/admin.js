//var User = require('../proxy').User;
//var Topic = require('../proxy').Topic;
//var Reply = require('../proxy').Reply;
//var TopicCollect = require('../proxy').TopicCollect;
var utility = require('utility');
var util = require('util');
//var TopicModel = require('../models').Topic;
//var ReplyModel = require('../models').Reply;
var tools = require('../common/tools');
var config = require('../config');
var EventProxy = require('eventproxy');
var validator = require('validator');
var utility = require('utility');
var _ = require('lodash');
var cache = require('../common/cache');

exports.showAdmin = function (req, res, next) {
    var page = parseInt(req.query.page, 10) || 1;
    page = page > 0 ? page : 1;
    var proxy = new EventProxy();
    proxy.fail(next);

    var user_limit = config.admin_list_user_count;
    User.getUsersByQuery({}, {limit: user_limit}, proxy.done('users', function (users) {
        return users;
    }));

    var topic_limit = config.admin_list_topic_count;
    Topic.getTopicsByQuery({}, {limit: topic_limit}, proxy.done('topics', function (topics) {
        return topics;
    }));

    var limit = config.list_topic_count;
    var pagesCacheKey = 'admin_pages';
    cache.get(pagesCacheKey, proxy.done(function (pages) {
        if (pages) {
            proxy.emit('pages', pages);
        } else {
            Topic.getCountByQuery({}, proxy.done(function (all_topics_count) {
                var pages = Math.ceil(all_topics_count / limit);
                cache.set(pagesCacheKey, pages, 60 * 1);
                proxy.emit('pages', pages);
            }));
        }
    }));

    proxy.all('topics', 'users', 'pages', function (topics, users, pages) {
        res.render('admin/index', {
            topics: topics,
            users: users,
            pages: pages,
            current_page: page,
        });
    });
    proxy.fail(next);
}
