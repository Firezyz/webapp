var express = require('express');
var sign = require('./controllers/sign');
var site = require('./controllers/site');
var test = require('./controllers/test');
var user = require('./controllers/user');
var message = require('./controllers/message');
var topic = require('./controllers/topic');
var reply = require('./controllers/reply');
var auth = require('./middlewares/auth');
var limit = require('./middlewares/limit');
var search = require('./controllers/search');
var manage = require('./controllers/manage');
var passport = require('passport');
var config = require('./config');
var admin = require('./controllers/admin')

var router = express.Router();

// home page
router.get('/', site.index);
router.get('/test', test.index);

router.get('/admin', auth.adminRequired, admin.showAdmin); // 跳转到管理员页面

router.get('/signup', sign.showSignup);  // 跳转到注册页面
router.post('/signup', sign.signup);  // 提交注册信息
router.post('/signout', sign.signout);  // 登出
router.get('/signin', sign.showLogin);  // 进入登录页面
router.post('/signin', sign.login);  // 登录校验
router.get('/active_account', sign.activeAccount);  //帐号激活

router.get('/search_pass', sign.showSearchPass);  // 找回密码页面
router.post('/search_pass', sign.updateSearchPass);  // 更新密码
router.get('/reset_pass', sign.resetPass);  // 进入重置密码页面
router.post('/reset_pass', sign.updatePass);  // 更新密码

// user controller
router.get('/user/:name', user.index); // 用户个人主页
router.get('/setting', auth.userRequired, user.showSetting); // 用户个人设置页
router.post('/setting', auth.userRequired, user.setting); // 提交个人信息设置
router.get('/stars', user.listStars); // 显示所有达人列表页
router.get('/users/top100', user.top100);  // 显示积分前一百用户页
router.get('/user/:name/collections', user.listCollectedTopics);  // 用户收藏的所有话题页
router.get('/user/:name/topics', user.listTopics);  // 用户发布的所有话题页
router.get('/user/:name/replies', user.listReplies);  // 用户参与的所有回复页
router.post('/user/set_star', auth.adminRequired, user.toggleStar); // 把某用户设为达人
router.post('/user/cancel_star', auth.adminRequired, user.toggleStar);  // 取消某用户的达人身份
router.post('/user/:name/block', auth.adminRequired, user.block);  // 禁言某用户
router.post('/user/:name/delete_all', auth.adminRequired, user.deleteAll);  // 删除某用户所有发言

// message controler
router.get('/my/messages', auth.userRequired, message.index); // 用户个人的所有消息页

// topic

// 新建文章界面
router.get('/topic/create', auth.userRequired, topic.create);

router.get('/topic/:tid', topic.index);  // 显示某个话题
router.post('/topic/:tid/top', auth.adminRequired, topic.top);  // 将某话题置顶
router.post('/topic/:tid/good', auth.adminRequired, topic.good); // 将某话题加精
router.get('/topic/:tid/edit', auth.userRequired, topic.showEdit);  // 编辑某话题
router.post('/topic/:tid/lock', auth.adminRequired, topic.lock); // 锁定主题，不能再回复

router.post('/topic/:tid/delete', auth.userRequired, topic.delete);

// 保存新建的文章
router.post('/topic/create', auth.userRequired, limit.peruserperday('create_topic', config.create_post_per_day), topic.put);

router.post('/topic/:tid/edit', auth.userRequired, topic.update);
router.post('/topic/collect', auth.userRequired, topic.collect); // 关注某话题
router.post('/topic/de_collect', auth.userRequired, topic.de_collect); // 取消关注某话题

// reply controller
router.post('/:topic_id/reply', auth.userRequired, limit.peruserperday('create_reply', config.create_reply_per_day), reply.add); // 提交一级回复
router.get('/reply/:reply_id/edit', auth.userRequired, reply.showEdit); // 修改自己的评论页
router.post('/reply/:reply_id/edit', auth.userRequired, reply.update); // 修改某评论
router.post('/reply/:reply_id/delete', auth.userRequired, reply.delete); // 删除某评论
router.post('/reply/:reply_id/up', auth.userRequired, reply.up); // 为评论点赞
router.post('/upload', auth.userRequired, topic.upload); //上传图片

router.get('/search', search.index);

router.get('/manage', manage.index);
router.post('/manage/user/:user_ids/delete', auth.userRequired, manage.index);
router.post('/manage/user/:user_ids/block', auth.userRequired, manage.index);
router.post('/manage/topic/:topic_ids/delete', auth.userRequired, manage.index);
router.post('/manage/topic/:topic_ids/top', auth.userRequired, manage.index);
router.post('/manage/topic/:topic_ids/good', auth.userRequired, manage.index);
router.post('/manage/topic/:topic_ids/lock', auth.userRequired, manage.index);
router.post('/manage/topic/:topic_ids/block', auth.userRequired, manage.index);

module.exports = router;
