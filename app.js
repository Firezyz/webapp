var config = require('./config');

require('colors');
var path = require('path');
var Loader = require('loader');
var LoaderConnect = require('loader-connect');
var express = require('express');
var session = require('express-session');
var passport = require('passport');
require('./middlewares/mongoose_log'); // 打印 mongodb 查询日志
require('./models');
var webRouter = require('./web_router');
var apiRouter = require('./api_router');
var auth = require('./middlewares/auth');
var errorPageMiddleware = require('./middlewares/error_page');
var proxyMiddleware = require('./middlewares/proxy');
var redis = require('connect-redis')(session);
var _ = require('lodash');
var csurf = require('csurf');
var compress = require('compression');
var bodyParser = require('body-parser');
var busboy = require('connect-busboy');
var errorhandler = require('errorhandler');
var cors = require('cors');
var requestLog = require('./middlewares/request_log');
var renderMiddleware = require('./middlewares/render');
var logger = require('./common/logger');
var helmet = require('helmet');
var bytes = require('bytes');


// 静态文件目录
var staticDir = path.join(__dirname, 'static');
// assets

var urlinfo = require('url').parse(config.host);
config.hostname = urlinfo.hostname || config.host;

var app = express();

// configuration in all env
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs-mate'));
app.enable('trust proxy');

// Request logger。请求时间
app.use(requestLog);

if (config.debug) {
    // 渲染时间
    app.use(renderMiddleware.render);
}

// 静态资源
if (config.debug) {
    app.use(LoaderConnect.less(__dirname)); // 测试环境用，编译 .less on the fly
}
app.use('/static', express.static(staticDir));
app.use('/agent', proxyMiddleware.proxy);

// 通用的中间件
app.use(require('response-time')());
app.use(helmet.frameguard('sameorigin'));
app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '1mb'}));
app.use(require('method-override')());
app.use(require('cookie-parser')(config.session_secret));
app.use(compress());
app.use(session({
    secret: config.session_secret,
    store: new redis({
        port: config.redis_port,
        host: config.redis_host,
    }),
    resave: true,
    saveUninitialized: true,
}));

// oauth 中间件
app.use(passport.initialize());

// github oauth
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});

// custom middleware
app.use(auth.authUser);
app.use(auth.blockUser());

if (!config.debug) {
    app.use(function (req, res, next) {
        if (req.path === '/api' || req.path.indexOf('/api') === -1) {
            csurf()(req, res, next);
            return;
        }
        next();
    });
    app.set('view cache', true);
}

// for debug
// app.get('/err', function (req, res, next) {
//   next(new Error('haha'))
// });

// set static, dynamic helpers
_.extend(app.locals, {
    config: config,
    Loader: Loader,
});

app.use(errorPageMiddleware.errorPage);
_.extend(app.locals, require('./common/render_helper'));
app.use(function (req, res, next) {
    res.locals.csrf = req.csrfToken ? req.csrfToken() : '';
    next();
});

app.use(busboy({
    limits: {
        fileSize: bytes(config.file_limit)
    }
}));

// routes
//app.use('/api', cors(), apiRouter);
app.use('/', webRouter);

// error handler
if (config.debug) {
    app.use(errorhandler());
} else {
    app.use(function (err, req, res, next) {
        logger.error(err);
        return res.status(500).send('500 status');
    });
}

if (!module.parent) {
    app.listen(config.port, function () {
        logger.info('Club listening on port', config.port);
        logger.info('You can debug your app with http://' + config.hostname + ':' + config.port);
        logger.info('');
    });
}

module.exports = app;
