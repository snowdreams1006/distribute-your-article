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

console.log("cookie", cookie.csdn);

// 请求参数
var requestConfig = {
    url: "https://blog.csdn.net/weixin_38171180",
    headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",
        "Cookie": cookie.csdn
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
    // 访问首页,解析出分页总数,依次遍历累加


    //https://blog.csdn.net/weixin_38171180/article/list/2?

    // $("#pageBox li.js-page-next.js-page-action.ui-pager").prev().text();


    // 初次访问解析出分页总数,并不计数
    var body = await syncRequest(requestConfig);

    console.log("body", body);
    

    // 解析出分页总数,依次遍历访问累加
    var total = parseIndex(body);
    console.log("total", total);


    // for (var i = 1; i <= total; i++) {
    //     requestConfig.url = "";

    //     var body = await syncRequest(requestConfig);

    //     parseCurrent(cheerio.load(body));
    // }

    // // 数据保存到本地
    // fs.writeFileSync(`./data/${now.format("YYYY-MM-DD")}.json`, JSON.stringify(result));
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
 *  解析首页
 * @param {html} body 
 */
function parseIndex(body) {
    // 解析页面结构
    var $ = cheerio.load(body);

    // 是否登录
    if (!isLogin($)) {
        return console.error("尚未登录,cookie 可能已失效!");
    }

    // 解析分页信息
    return parsePagenation($);
}

/**
 *  是否已登录
 * @param {html} $ 
 */
function isLogin($) {
    // 已经登录不会出现关注按钮,尚未登录会出现
    var userAttention = $("#btnAttent");

    var nologinFlag = userAttention && userAttention.text();
    if (!nologinFlag) {
        console.log("已经登录");

        return true;
    } else {
        console.log("尚未登录");

        return false;
    }
}

/**
 *  解析分页
 * @param {html} body 
 */
function parsePagenation($) {
    // 解析尾页
    var lastPage = ($("#pageBox li.js-page-next.js-page-action.ui-pager").prev().text()) * 1;

    console.log("lastPage", lastPage);

    var pagenation = $("#pageBox li.ui-pager");


    for (var i = 0; i < pagenation.length; i++) {
        var page = pagenation[i];

        console.log($(page).text());

    }

    return lastPage;
}

/**
 *  解析当前页
 * @param {html} body 
 */
function parseCurrent($) {
    // 解析当前页
    var atricles = $("#articlesList div.article-item");
    for (var i = 0; i < atricles.length; i++) {
        var article = atricles[i];

        var header = $(article).find("h3.item-title");
        var body = $(article).find("div.item-txt");
        var footer = $(article).find("div.item-btm");

        // 标题以及链接
        var titile = $(header).find("a.title-detail").text().trim();
        var href = $(header).find("a.title-detail").attr("href");
        // 内容概要
        var content = $(body).find("p.item-bd").text()
        // 阅读量,推荐量以及评论量
        var readCount = $(footer).find(".right-info > div:nth-child(1) > em").text().trim();
        readCount = (readCount.substr(0, readCount.lastIndexOf("浏览"))) * 1
        var recommendCount = $(footer).find(".right-info > div:nth-child(2) > em").text().trim();
        recommendCount = (recommendCount.substr(0, recommendCount.lastIndexOf("推荐"))) * 1;
        var commentCount = $(footer).find(".right-info > div:nth-child(3) > em").text().trim();
        commentCount = (commentCount.substr(0, commentCount.lastIndexOf("评论"))) * 1;

        // 文章汇总数据
        result.atricles.push({
            "titile": titile,
            "href": href,
            "content": content
        });
        result.readCount += readCount;
        result.recommendCount += recommendCount;
        result.commentCount += commentCount;

        // 当前页正在解析中
        console.log(`当前页面解析中,一共${atricles.length}篇文章,正在解析第${i+1}篇,标题: ${titile} 阅读量: ${readCount} 推荐量: ${recommendCount} 评论数: ${commentCount}`);
    }

    // 当前页解析完毕
    console.log();
    console.log(`当前页面解析完毕,一共${result.atricles.length}篇文章, 阅读量: ${result.readCount} 推荐量: ${result.recommendCount} 评论数: ${result.commentCount}`);
    console.log();
}