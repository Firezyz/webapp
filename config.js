var path = require('path');

var config = {
    debug: true,

    name: 'JLUclub', // 社区名字
    description: 'JLU技术交流社区', // 社区的描述
    keywords: '技术,JLU,吉大',

    site_headers: [
        '<meta name="author" content="Firezyz@JLU" />'
    ],
    site_logo: '', //'/public/images/cnodejs_light.svg', // default is `name`
    site_icon: '', //'/public/images/cnode_icon_32.png', // 默认没有 favicon, 这里填写网址
    // 右上角的导航区
    site_navs: [
        // 格式 [ path, title, [target=''] ]
        ['/about', '关于']
    ],
    // cdn host，如 http://cnodejs.qiniudn.com
    //site_static_host: '', // 静态文件存储域名
    // 社区的域名
    host: 'localhost',
    // 默认的Google tracker ID，自有站点请修改，申请地址：http://www.google.com/analytics/
    //google_tracker_id: '',
    // 默认的cnzz tracker ID，自有站点请修改
    //cnzz_tracker_id: '',

    // mongodb 配置
    db: 'mongodb://127.0.0.1/jlu_club_dev',
    es_host: 'localhost',
    es_port: '9200',
    es_log: 'trace',
    es_index: 'jlu_dev_test',

    // redis 配置，默认是本地
    redis_host: '127.0.0.1',
    redis_port: 6379,
    redis_db: 0,

    session_secret: 'firezyz', // 务必修改
    auth_cookie_name: 'jlu_club',

    // 程序运行的端口
    port: 3000,

    // 话题列表显示的话题数量
    list_topic_count: 20,

    list_reply_count: 50,

    // 管理员话题列表显示的话题数量
    admin_list_topic_count: 50,

    // 管理员用户列表显示的话题数量
    admin_list_user_count: 50,

    // 邮箱配置
    mail_opts: {
        host: 'smtp.qq.com',
        secureConnection: true,
        port: 465,
        auth: {
            user: '1063784603@qq.com',
            pass: 'KLKLsys24678!'
        }
    },

    //weibo app key
    weibo_key: 'firezyz',
    weibo_id: 'firezyz',

    // admin 可删除话题，编辑标签。把 user_login_name 换成你的登录名
    admins: {firezyz: true, admin: true},

    webmasters: {firezyz: true, admin: true},

    // github 登陆的配置
    //GITHUB_OAUTH: {
    //clientID: 'firezyz@163.com', clientSecret: 'yatou521!', callbackURL: 'http://cnodejs.org/auth/github/callback'
    //},
    // 是否允许直接注册（否则只能走 github 的方式）
    allow_sign_up: true,

    // oneapm 是个用来监控网站性能的服务
    //oneapm_key: '',

    // 下面两个配置都是文件上传的配置

    // 7牛的access信息，用于文件上传
    //qn_access: {
    //    accessKey: 'your access key',
    //    secretKey: 'your secret key',
    //    bucket: 'your bucket name',
    //    origin: 'http://your qiniu domain',
    //    // 如果vps在国外，请使用 http://up.qiniug.com/ ，这是七牛的国际节点
    //    // 如果在国内，此项请留空
    //    uploadURL: 'http://xxxxxxxx',
    //},

    // 文件上传配置
    // 注：如果填写 qn_access，则会上传到 7牛，以下配置无效
    upload: {
        path: path.join(__dirname, 'static/upload/'),
        url: '/static/upload/'
    },

    default_avatar_path: '/static/images/default_avatar.jpg',

    file_limit: '5MB',

    // 版块
    tabs: [
        ['front', '前端'],
        ['backend', '后端'],
        ['app', '客户端'],
        ['ask', '问答'],
        ['job', '招聘'],
        ['exam', '考试'],
    ],

    // 极光推送
    //jpush: {
    //    appKey: 'YourAccessKeyyyyyyyyyyyy',
    //    masterSecret: 'YourSecretKeyyyyyyyyyyyyy',
    //    isDebug: false,
    //},

    create_post_per_day: 100, // 每个用户一天可以发的主题数
    create_reply_per_day: 100, // 每个用户一天可以发的评论数
    visit_per_day: 10000, // 每个 ip 每天能访问的次数
    user_is_advance: 1,
};

if (process.env.NODE_ENV === 'test') {
    config.db = 'mongodb://127.0.0.1/jlu_club_test';
}

module.exports = config;
