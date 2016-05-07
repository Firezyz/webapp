var EventProxy = require('eventproxy');
//var models = require('../models');
//var Topic = models.Topic;
//var User = require('./user');
//var Reply = require('./reply');
//var at = require('../common/at');
//var _ = require('lodash');
//var config = require('../config');
var elasticsearch = require('elasticsearch');

var tools = require('../common/tools');
var Bmob = require("bmob").Bmob;
//初始化，第一个参数是Application_id，第二个参数是REST API Key
Bmob.initialize("4899a0aadc762a1813a1aa7cdd758037", "8bffb9cf405880dfa4333f8b059e8e14");

//var client = new elasticsearch.Client({
//    host: config.es_host + ':' + config.es_port,
//    log: config.es_log
//});
//client.indices.create({index: config.es_index});
//
//client.indices.putMapping({
//    index: config.es_index,
//    type: 'article',
//    body: {
//        article: {
//            properties: {
//                title: {
//                    type: 'string',
//                    term_vector: 'with_positions_offsets',
//                    analyzer: 'ik_syno',
//                    search_analyzer: 'ik_syno',
//                },
//                content: {
//                    type: 'string',
//                    term_vector: 'with_positions_offsets',
//                    analyzer: 'ik_syno',
//                    search_analyzer: 'ik_syno',
//                }
//            }
//        }
//    }
//});
//
//var getEsBody = function () {
//    return {
//        index: config.es_index,
//        type: 'article'
//    };
//}
//
///**
// * 根据主题ID获取主题
// * Callback:
// * - err, 数据库错误
// * - topic, 主题
// * - author, 作者
// * - lastReply, 最后回复
// * @param {String} id 主题ID
// * @param {Function} callback 回调函数
// */
//exports.getTopicById = function (id, callback) {
//    var proxy = new EventProxy();
//    var events = ['topic', 'author', 'last_reply'];
//    proxy.assign(events, function (topic, author, last_reply) {
//        if (!author) {
//            return callback(null, null, null, null);
//        }
//        return callback(null, topic, author, last_reply);
//    }).fail(callback);
//
//    Topic.findOne({_id: id}, proxy.done(function (topic) {
//        if (!topic) {
//            proxy.emit('topic', null);
//            proxy.emit('author', null);
//            proxy.emit('last_reply', null);
//            return;
//        }
//        proxy.emit('topic', topic);
//
//        User.getUserById(topic.author_id, proxy.done('author'));
//
//        if (topic.last_reply) {
//            Reply.getReplyById(topic.last_reply, proxy.done(function (last_reply) {
//                proxy.emit('last_reply', last_reply);
//            }));
//        } else {
//            proxy.emit('last_reply', null);
//        }
//    }));
//};
//
///**
// * 获取关键词能搜索到的主题数量
// * Callback:
// * - err, 数据库错误
// * - count, 主题数量
// * @param {String} query 搜索关键词
// * @param {Function} callback 回调函数
// */
//exports.getCountByQuery = function (query, callback) {
//    Topic.count(query, callback);
//};

exports.getTopicsForIndex = function (current_page, limit, callback) {
    var Topic = Bmob.Object.extend("topic");
    var query = new Bmob.Query(Topic);
    query.notEqualTo("deleted", true);
    // 查询所有数据
    query.find({
        success: function (result) {
            callback(tools.getObjListAttr(result));
        },
        error: function (error) {
            alert("查询失败: " + error.code + " " + error.message);
        }
    });
}
//
///**
// * 根据关键词，获取主题列表
// * Callback:
// * - err, 数据库错误
// * - count, 主题列表
// * @param {String} query 搜索关键词
// * @param {Object} opt 搜索选项
// * @param {Function} callback 回调函数
// */
//exports.getTopicsByQuery = function (query, opt, callback) {
//    query.deleted = false;
//    Topic.find(query, {}, opt, function (err, topics) {
//        if (err) {
//            return callback(err);
//        }
//        if (topics.length === 0) {
//            return callback(null, []);
//        }
//
//        var proxy = new EventProxy();
//        proxy.after('topic_ready', topics.length, function () {
//            topics = _.compact(topics); // 删除不合规的 topic
//            return callback(null, topics);
//        });
//        proxy.fail(callback);
//
//        topics.forEach(function (topic, i) {
//            var ep = new EventProxy();
//            ep.all('author', 'reply', function (author, reply) {
//                // 保证顺序
//                // 作者可能已被删除
//                if (author) {
//                    topic.author = author;
//                    topic.reply = reply;
//                } else {
//                    topics[i] = null;
//                }
//                proxy.emit('topic_ready');
//            });
//
//            User.getUserById(topic.author_id, ep.done('author'));
//            // 获取主题的最后回复
//            Reply.getReplyById(topic.last_reply, ep.done('reply'));
//        });
//    });
//};
//
//// for sitemap
//exports.getLimit5w = function (callback) {
//    Topic.find({deleted: false}, '_id', {limit: 50000, sort: '-create_at'}, callback);
//};
//
///**
// * 获取所有信息的主题
// * Callback:
// * - err, 数据库异常
// * - message, 消息
// * - topic, 主题
// * - author, 主题作者
// * - replies, 主题的回复
// * @param {String} id 主题ID
// * @param {Function} callback 回调函数
// */
//exports.getFullTopic = function (id, callback) {
//    var proxy = new EventProxy();
//    var events = ['topic', 'author', 'replies'];
//    proxy
//        .assign(events, function (topic, author, replies) {
//            callback(null, '', topic, author, replies);
//        })
//        .fail(callback);
//
//    Topic.findOne({_id: id, deleted: false}, proxy.done(function (topic) {
//        if (!topic) {
//            proxy.unbind();
//            return callback(null, '此话题不存在或已被删除。');
//        }
//        at.linkUsers(topic.content, proxy.done('topic', function (str) {
//            topic.linkedContent = str;
//            return topic;
//        }));
//
//        User.getUserById(topic.author_id, proxy.done(function (author) {
//            if (!author) {
//                proxy.unbind();
//                return callback(null, '话题的作者被外星人抓走啦。');
//            }
//            proxy.emit('author', author);
//        }));
//
//        Reply.getRepliesByTopicId(topic._id, proxy.done('replies'));
//    }));
//};
//
///**
// * 更新主题的最后回复信息
// * @param {String} topicId 主题ID
// * @param {String} replyId 回复ID
// * @param {Function} callback 回调函数
// */
//exports.updateLastReply = function (topicId, replyId, callback) {
//    Topic.findOne({_id: topicId}, function (err, topic) {
//        if (err || !topic) {
//            return callback(err);
//        }
//        topic.last_reply = replyId;
//        topic.last_reply_at = new Date();
//        topic.reply_count += 1;
//        topic.save(callback);
//    });
//};
//
///**
// * 根据主题ID，查找一条主题
// * @param {String} id 主题ID
// * @param {Function} callback 回调函数
// */
//exports.getTopic = function (id, callback) {
//    Topic.findOne({_id: id}, callback);
//};
//
///**
// * 将当前主题的回复计数减1，并且更新最后回复的用户，删除回复时用到
// * @param {String} id 主题ID
// * @param {Function} callback 回调函数
// */
//exports.reduceCount = function (id, callback) {
//    Topic.findOne({_id: id}, function (err, topic) {
//        if (err) {
//            return callback(err);
//        }
//
//        if (!topic) {
//            return callback(new Error('该主题不存在'));
//        }
//        topic.reply_count -= 1;
//
//        Reply.getLastReplyByTopId(id, function (err, reply) {
//            if (err) {
//                return callback(err);
//            }
//
//            if (reply.length !== 0) {
//                topic.last_reply = reply[0]._id;
//            } else {
//                topic.last_reply = null;
//            }
//
//            topic.save(callback);
//        });
//
//    });
//};
//
//exports.newAndSave = function (title, content, tab, authorId, callback) {
//    var topic = new Topic();
//    topic.title = title;
//    topic.content = content;
//    topic.tab = tab;
//    topic.author_id = authorId;
//    var es_body = getEsBody();
//    es_body['id'] = topic._id.toString();
//    es_body['body'] = {title: title, content: content};
//
//    console.error(es_body);
//
//    client.index(es_body, function (err) {
//        if (err) {
//            console.error(err);
//            console.error("topic index save failed");
//        } else {
//            topic.save(callback);
//        }
//    });
//};

