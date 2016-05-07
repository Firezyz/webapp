var models = require('../models');
var tools = require('../common/tools');
var config = require('../config');
var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
    host: config.es_host + ':' + config.es_port,
    log: config.es_log
});
client.indices.create({index: config.es_index});

exports.search = function (q, callback) {
    es_body = {index: config.es_index, type: 'article'};
    query_list = q.split(' ');
    query_conditions = [];
    query_list.forEach(function (query) {
        query_conditions.append({
            match: {
                title: {
                    query: query,
                    minimum_should_match: '50%',
                    boost: 4,
                }
            }
        });
        query_conditions.append({
            match: {
                content: {
                    query: query,
                    minimum_should_match: '75%',
                    boost: 4,
                }
            }
        });

    });
    es_body['body'] = {
        query: {
            dis_max: {
                queries: query_conditions,
                tie_breaker: 0.3
            }
        },
        highlight: {
            pre_tags: ['<b>'],
            post_tags: ['</b>'],
            fields: {
                title: {},
                content: {},
            }
        }
    };

    client.search(es_body, callback);
};

