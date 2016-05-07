var User = require('../proxy/user');
var Topic = require('../proxy/topic');
var config = require('../config');
var EventProxy = require('eventproxy');
var cache = require('../common/cache');
var xmlbuilder = require('xmlbuilder');
var renderHelper = require('../common/render_helper');
var _ = require('lodash');

exports.index = function (req, res, next) {
    var page = parseInt(req.query.page, 10) || 1;
    page = page > 0 ? page : 1;
    //var tab = req.query.tab || 'all';
    //
    var ep = EventProxy.create('topics',
        function (topics) {
            res.render('index', {
                topics: topics
            });
        });
    ep.fail(next);
    //
    //// 取主题
    //var query = {};
    //if (tab && tab !== 'all') {
    //    if (tab === 'good') {
    //        query.good = true;
    //    } else {
    //        query.tab = tab;
    //    }
    //}
    //
    //var limit = config.list_topic_count;
    //var options = {skip: (page - 1) * limit, limit: limit, sort: '-top -last_reply_at'};
    //
    var current_page = 1;
    var limit = 20;
    Topic.getTopicsForIndex(current_page, limit, function (topics) {
        topics.forEach(function (topic) {
            User.getNameById(topic.author_id, function (result) {
                topic.author_name = result.nickname || result.username;
                ep.emit('author_name')
                console.log(topic.author_name);
            });
        });
        ep.after('author_name',topics.length, function () {
            ep.emit('topics', topics);
        });

    });

    console.log('test');
    //
    //// 取排行榜上的用户
    //cache.get('tops', proxy.done(function (tops) {
    //    if (tops) {
    //        proxy.emit('tops', tops);
    //    } else {
    //        User.getUsersByQuery(
    //            {is_block: false},
    //            {limit: 10, sort: '-score'},
    //            proxy.done('tops', function (tops) {
    //                cache.set('tops', tops, 60 * 1);
    //                return tops;
    //            })
    //        );
    //    }
    //}));
    //// END 取排行榜上的用户
    //
    //// 取0回复的主题
    //cache.get('no_reply_topics', proxy.done(function (no_reply_topics) {
    //    if (no_reply_topics) {
    //        proxy.emit('no_reply_topics', no_reply_topics);
    //    } else {
    //        Topic.getTopicsByQuery(
    //            {reply_count: 0, tab: {$ne: 'job'}},
    //            {limit: 5, sort: '-create_at'},
    //            proxy.done('no_reply_topics', function (no_reply_topics) {
    //                cache.set('no_reply_topics', no_reply_topics, 60 * 1);
    //                return no_reply_topics;
    //            }));
    //    }
    //}));
    //// END 取0回复的主题
    //
    //// 取分页数据
    //var pagesCacheKey = JSON.stringify(query) + 'pages';
    //cache.get(pagesCacheKey, proxy.done(function (pages) {
    //    if (pages) {
    //        proxy.emit('pages', pages);
    //    } else {
    //        Topic.getCountByQuery(query, proxy.done(function (all_topics_count) {
    //            var pages = Math.ceil(all_topics_count / limit);
    //            cache.set(pagesCacheKey, pages, 60 * 1);
    //            proxy.emit('pages', pages);
    //        }));
    //    }
    //}));
    //// END 取分页数据
    //
    //var tabName = renderHelper.tabName(tab);
    //proxy.all('topics', 'tops', 'no_reply_topics', 'pages',
    //    function (topics, tops, no_reply_topics, pages) {
    //        res.render('index', {
    //            topics: topics,
    //            current_page: page,
    //            list_topic_count: limit,
    //            tops: tops,
    //            no_reply_topics: no_reply_topics,
    //            pages: pages,
    //            tabs: config.tabs,
    //            tab: tab,
    //            pageTitle: tabName && (tabName + '版块'),
    //        });
    //    });
};

