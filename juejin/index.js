var fs = require("fs");
var moment = require("moment");
var request = require("request");
var cheerio = require("cheerio");

// 日期格式化
moment.locale("zh-cn");
var now = moment();

// 读取自定义 cookie
var cookie = readCookie();
cookie = JSON.parse(cookie);

console.log("cookie", cookie.jianshu);

// 请求参数
var requestConfig = {
    url: "https://juejin.im/user/582d5cb667f356006331e586/posts",
    qs: {

    },
    headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",
        "Cookie": cookie.juejin
    },
    jar: true
};

// 解析结果
var result = {
    atricles: [],
    readCount: 0,
    recommendCount: 0,
    commentCount: 0
};

// 模拟登录直接访问首页
indexWithCookie(requestConfig);

/**
 * 读取 cookie(自定义 cookie)
 */
function readCookie() {
    return fs.readFileSync("../.config").toString();
}

/**
 * 同步访问首页(自定义 cookie)
 */
async function indexWithCookie(requestConfig) {
    try {

        // 解析首页数据
        await parseIndex();

        // 请求分页数据
        await requestPagenationData("");

    } catch (error) {
        console.error("error", error);
    }
}

/**
 * 解析首页
 */
async function parseIndex() {
    // 初次访问解析出分页总数,并不计数
    var body = await syncRequest(requestConfig);

    // 判断是否登录
    isLogin(cheerio.load(body));

    // 数据保存到本地
    fs.writeFileSync(`./data/${now.format("YYYY-MM-DD")}.html`, body);
}

/**
 * 请求数据
 */
async function requestPagenationData(before) {
    console.log("requestPagenationData:before", before);

    //默认规则分页查询
    requestConfig.url = "https://timeline-merger-ms.juejin.im/v1/get_entry_by_self";
    requestConfig.qs = {
        "src": "web",
        "uid": "582d5cb667f356006331e586",
        "device_id": "1560005329014",
        "token": "eyJhY2Nlc3NfdG9rZW4iOiJENVp4b2l6ajlUeEdmeGpxIiwicmVmcmVzaF90b2tlbiI6IlhZYWNvTEk5WUVxNHJpcUIiLCJ0b2tlbl90eXBlIjoibWFjIiwiZXhwaXJlX2luIjoyNTkyMDAwfQ%3D%3D",
        "targetUid": "582d5cb667f356006331e586",
        "type": "post",
        "before": before,
        "limit": "20",
        "order": "createdAt"
    };

    var body = await syncRequest(requestConfig);

    // 数据保存到本地
    fs.writeFileSync(`./data/${now.format("YYYY-MM-DD")}-${requestConfig.qs.before}.json`, body);

    // 解析当前分页数据
    before = parseCurrent(body);
    console.log("parseCurrent:before", before);

    // 递归请求分页数据
    if (before) {
        requestPagenationData(before);
    }
}

/**
 *  同步请求
 * @param {object} options 
 */
function syncRequest(options) {
    return new Promise(function(resolve, reject) {
        request.get(options, function(error, response, body) {
            if (error) {
                reject(error);
            } else {
                resolve(body);
            }
        });
    });
}

/**
 *  是否已登录
 * @param {html} $ 
 */
function isLogin($) {
    // 已经登录会出现用户个人头像,否则不出现
    var settingBtn = $("#juejin div.user-info-block > div.action-box > button.setting-btn");

    var loginFlag = settingBtn && settingBtn.text();
    if (loginFlag) {
        console.log("已经登录: " + settingBtn.text());

        return true;
    } else {
        console.log("尚未登录");

        return false;
    }
}

/**
 *  解析首页
 * @param {html} body 
 */
function parseCurrent(body) {
    // 解析文章基本信息
    body = JSON.parse(body);
    if (body.s == 1 && body.d.total > 0) {
        var atricles = body.d.entrylist;
        for (var i = 0; i < atricles.length; i++) {
            var article = atricles[i];

            // 标题以及链接
            var titile = article.titile;
            var href = article.originalUrl;
            // 内容概要
            var content = article.content;
            // 阅读量,评论量以及喜欢
            var readCount = article.viewsCount;
            var commentCount = article.commentsCount;
            var recommendCount = article.collectionCount;

            // 文章汇总数据
            result.atricles.push({
                "titile": titile,
                "href": href,
                "content": content
            });
            result.readCount += readCount;
            result.commentCount += commentCount;
            result.recommendCount += recommendCount;

            // 当前页正在解析中
            console.log(`当前页面解析中,一共${atricles.length}篇文章,正在解析第${i+1}篇,标题: ${titile} 点赞数: ${recommendCount} 评论数: ${commentCount} 阅读数: ${readCount}`);
        }

        return atricles[atricles.length - 1].createdAt;
    }

    // 当前页解析完毕
    console.log();
    console.log(`当前页面解析完毕,一共${result.atricles.length}篇文章, 点赞数: ${recommendCount} 评论数: ${commentCount} 阅读数: ${readCount}`);
    console.log();

    return;
}