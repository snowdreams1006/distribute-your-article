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

        // 初次访问解析出分页总数,并不计数
        var body = await syncRequest(requestConfig);

        // 数据保存到本地
        fs.writeFileSync(`./data/${now.format("YYYY-MM-DD")}.html`, body);

        //默认规则分页查询
        requestConfig.url = "https://timeline-merger-ms.juejin.im/v1/get_entry_by_self";
        requestConfig.qs = {
            "src": "web",
            "uid": "582d5cb667f356006331e586",
            "device_id": "1560005329014",
            "token": "eyJhY2Nlc3NfdG9rZW4iOiJENVp4b2l6ajlUeEdmeGpxIiwicmVmcmVzaF90b2tlbiI6IlhZYWNvTEk5WUVxNHJpcUIiLCJ0b2tlbl90eXBlIjoibWFjIiwiZXhwaXJlX2luIjoyNTkyMDAwfQ%3D%3D",
            "targetUid": "582d5cb667f356006331e586",
            "type": "post",
            "before": "",
            "limit": "20",
            "order": "createdAt"
        };

        body = await syncRequest(requestConfig);

        // 数据保存到本地
        fs.writeFileSync(`./data/${now.format("YYYY-MM-DD")}-${requestConfig.qs.before}.json`, body);

        parseCurrent(body);

        // for (var i = 1; i <= total; i++) {
        //     requestConfig.qs = {
        //         "page": i
        //     };

        //     var body = await syncRequest(requestConfig);

        //     // 数据保存到本地
        //     fs.writeFileSync(`./data/${now.format("YYYY-MM-DD")}.html`, body);

        //     parseCurrent(cheerio.load(body));
        // }

        // // 数据保存到本地
        // fs.writeFileSync(`./data/${now.format("YYYY-MM-DD")}.json`, JSON.stringify(result));

    } catch (error) {
        console.error("error", error);
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
 *  是否是最大页码
 * @param {html} $ 
 */
function isTotal($) {
    // 若超过最大页码,激活选项卡是动态而不是文章
    return $("#outer-container > ul > li.active > a").attr("href") == "/users/577b0d76ab87/timeline";
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
        console.log("尚未登录: " + body);

        return false;
    }
}

/**
 *  解析首页
 * @param {html} body 
 */
function parseCurrent($) {
    // 解析文章基本信息
    var atricles = $("#list-container li");
    for (var i = 0; i < atricles.length; i++) {
        var article = atricles[i];

        var header = $(article).find("a.title");
        var body = $(article).find("p.abstract");
        var footer = $(article).find("div.meta");

        // 标题以及链接
        var titile = $(header).text().trim();
        var href = $(header).attr("href");
        // 内容概要
        var content = $(body).text();
        // 阅读量,评论量以及喜欢
        var readCount = ($(footer).find(".ic-list-read").parent().text().trim()) * 1;
        var commentCount = ($(footer).find(".ic-list-comments").parent().text().trim()) * 1;
        var recommendCount = ($(footer).find(".ic-list-like").parent().text().trim()) * 1;

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
        console.log(`当前页面解析中,一共${atricles.length}篇文章,正在解析第${i+1}篇,标题: ${titile} 阅读量: ${readCount} 评论数: ${commentCount} 喜欢数: ${recommendCount}`);
    }

    // 当前页解析完毕
    console.log();
    console.log(`当前页面解析完毕,一共${result.atricles.length}篇文章, 阅读量: ${result.readCount} 评论数: ${result.commentCount} 喜欢数: ${result.recommendCount}`);
    console.log();
}