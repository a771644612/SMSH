/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://smsh.applinzi.com/index.php/';

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {

        host,

        // 登录地址，用于建立会话
        loginUrl: `${host}/User/login/`,

        // 测试的请求地址，用于测试会话
        requestUrl: `${host}/User/info/`,

        // 测试的信道服务地址
        tunnelUrl: `${host}/weapp/tunnel`,

        // 上传图片接口
        uploadUrl: `${host}/weapp/upload`,

        //签到以及活动URL
        checkinUrl:`${host}/User/checkIn`,

        //获取用户信息URL
        //例子:`${host}/User/Info` GET         获取URL 
        // `${host}/User/Info`     POST 方法： 设置用户信息
        //  可选参数: address ,tel ,name,addressprovince,addresscity
        infoUrl:`${host}/User/Info`,

        // 微信小程序登出
        // 直接 POST /User/logout 即可
        // 前端应该显示登录前的页面
        logoutUrl: `${host}/User/Logout`,

        // 获取用户积分
        // 直接 GET /User/Credits 即可
        // 应该在用户界面每次 onload 的时候加载（如果已经登陆的话）
        creditsUrl : `${host}/User/Credits`,

        //获取用户收藏书籍URL GET 获取信息 POST 传递信息 DELETE 删除收藏
        //${host}/Book/favorites   POST 将id为4的书传递给后台
        //${host}/Book/favoeites/1/10/true  true代表按照bookid升序排列
        //${host}/Book/favoeites/1/10
        //${host}/Book/favoeites/1        
        // 参数 book_id
        favoritesUrl:`${host}/Book/favorite`,
        
        //按页获取订单${host}/order/1    获取第一页（默认一页是10）
        //            ${host}/order/1/12  获取第一页 每页12个   
        //            ${host}/order/1/12/true 选定按照升序排列
        //            按页获取订单是按照时间排序 默认降序摆列
        //            ${host}/order/getById/1 获取编号为1的详细信息
        //获取全部订单${host}/Order/  GET
        ordersUrl:`${host}/Order`,


        //订单确认
        //POST 方法
        //参数：  id int 要确认的订单
        //        这个方法近用于确认 处于待确认状态的订单
        ordersValidateUrl:`${host}/Order/validate`,

        // 按页获取图书
        // 比如：
        // ${host}/Book/Page/1/10 GET 获得第一页书籍，一页为10本书（实际返回可能不够10本）
        // ${host}/Book/Page/1 GET 获得第一页书籍，默认一页 10 本
        // 返回的是一个**书籍数组**，其中每一本书的结构：
        //      'id' : (int) // 书籍的 id，返回 0 表示书籍不存在
        //      'ISBN' : (string) // 书籍的 ISBN，该项在数据库中唯一
        //      'name' : (string) // 书籍的名称
        //      'category' : (string) // 书籍的分类
        //      'author' : (string) // 书籍的作者
        //      'left' : (int) // 书籍的剩余数量
        //      'price' : (int) // 书籍的价格，单位为分
        //      'brief' : (string) // 书籍的介绍
        //      'cover' : (string) // 图书的封面，如果没有就返回默认图片
        //      'jdlink' : (string) // 京东购买链接
        //      'ddlink' : (string) // 当当购买链接
        //      'tmlink' : (string) // 天猫购买链接
        // 这个结构经常会变化，以 Book_model.php 注释为准
        bookPageUrl: `${host}/Book/Page`,


        // 使用方法和上面一致
        bookPVPageUrl : `${host}/Book/Page/Views`,


        // 搜索图书
        // POST keyowrd = '他' /Book/Page/1/10
        // 搜索图书标题或者作者中含有'他'的图书，每页10本返回第一页
        // 返回结果的结构跟上面一致
        searchBookUrl : `${host}/Book/Page`,

        // 获取独立的某本书
        // 比如：
        // ${host}/Book/1 GET 获取 id 为 1 书籍的详细信息
        // 书的结构和上面一致

        bookUrl: `${host}/Book`,


        // 添加评论
        // 用 POST 方法传递参数
        //{
        //    'contents' : (string) 内容
        //    'book_id' : (int) 书籍id
        //    'order_id' : (int) 订单id
        //}
        commentUrl : `${host}/Comment`,

        // 按图书获取评论
        // GET
        // /Comment/Book/1/2/3/4
        // 获取书籍id为2的书籍的第3页评论（每页4条）并且按照**点赞**排序
        // 第一个参数为0表示默认时间排序，为1表示按点赞排序
        commentBookUrl: `${host}/Comments/Book`,

        // 按用户获取评论
        // GET
        // /Comment/User/1/dsadawd/3/4
        // 除了第二个参数变成用户id以外没有区别
        commentUserUrl: `${host}/Comments/User`,

        // 给评论点赞
        // POST /Comment/1
        // 表示给id为1的评论点赞
        likeCommentUrl: `${host}/Comment`,

        // 获取正在进行的活动
        // GET
        // /Activities/Going/1
        // 获取第一页进行中的活动，默认一页25
        // /Activities/Going/1/10
        // 一页数量可以更改
        activitiesGoingUrl: `${host}/Activities/Going`,

        // 使用方法同上
        activitiesStoppedUrl: `${host}/Activities/Stopped`,

        // 获得某个轮盘具体信息
        // 比如 /Round/1 GET 获得id为1的轮盘信息，其中id就是之前Activity的id
        roundDetailsUrl: `${host}/Round`,

        // 参加轮盘活动
        // 比如 /Round/1 PUT 参加id为1的轮盘
        // 不需要传入其他参数
        doRoundUrl: `${host}/Round`,

        // 使用方法和 roundDetailsUrl 一致
        bargainDetailsUrl : `${host}/Bargain`,

        // 使用方法和 doRoundUrl 一致
        doBargainUrl :`${host}/Bargain`,

        // 购买砍价图书
        // 比如 POST /Bargain/1 购买砍价id为1的图书
        // 不用传其他数据
        buyBargainedUrl : `${host}/Bargain`,
        
        // 正常价格购买图书
        // 需要 POST 一个 address
        // 比如 POST /Book/1 同时传入 address : blabla 购买ID为1的书
        buyBookUrl:`${host}/Book`,

        //参加某一个抽奖活动
        //GET ${host}/lottery/joinlottery/23  参加id为23的抽奖活动
        joinLotteryUrl: `${host}/lottery/joinlottery/`,

        //获取某一个抽奖活动的具体信息
        //GET ${host}/lottery/12 获取id为12的抽奖活动具体信息
        LotteryUrl:`${host}/lottery`,

        // 获取首页轮播图
        // GET /Swaps 获取所有轮播图
        // 最多只有9个
        swapUrl: `${host}/Swaps`
    }
};

module.exports = config;