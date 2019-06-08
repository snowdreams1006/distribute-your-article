var fs = require("fs");
var request = require("request");
var cheerio = require("cheerio");

// 读取自定义 cookie
var cookie = readCookie();
cookie = JSON.parse(cookie);

console.log("cookie", cookie.imooc);

// 模拟登录直接访问首页
indexWithCookie();

/**
 * 读取 cookie(自定义 cookie)
 */
function readCookie() {
    return fs.readFileSync("../.config").toString();
}

/**
 * 访问首页(自定义 cookie)
 */
function indexWithCookie() {
    request.get({
        url: "https://www.imooc.com/u/index/articles",
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",
            "Cookie": cookie.imooc
        },
        jar: true
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {

            parseIndex(body);
        } else {
            console.error("访问首页失败", error);
        }
    });
}

/**
 *  解析首页
 * @param {html} body 
 */
function parseIndex(body) {
    var $ = cheerio.load(body);

    // 已经登录应该停留在手记页面,尚未登录则跳转到登录页面
    var usernameInfo = $("#main .user-info .user-name>span");

    var loginFlag = usernameInfo && usernameInfo.text();
    if (loginFlag) {
        console.log("已经登录: " + usernameInfo.text());
    } else {
        console.log("尚未登录: " + body);
    }

    // 解析文章基本信息
    var atricles = $("#articlesList div.article-item");
    for (var i = 0; i < atricles.length; i++) {
        var article = atricles[i];

        var header = $(article).find("h3.item-title");
        var body = $(article).find("div.item-txt");
        var footer = $(article).find("div.item-btm");

        // 标题以及链接
        var titile = $(header).find("a.title-detail").text().trim();
        var href = $(header).find("a.title-detail").attr("href");

        console.log("titile", titile);
        console.log("href", href);

        // 内容概要
        var content = $(body).find("p.item-bd").text();

        console.log("content", content);

        // 阅读量,推荐量以及评论量
        var readCount = $(footer).find(".right-info > div:nth-child(1) > em").text().trim();
        readCount = readCount.substr(0, readCount.lastIndexOf("浏览"));

        console.log("readCount", readCount);

        var recommendCount = $(footer).find(".right-info > div:nth-child(2) > em").text().trim();
        recommendCount = recommendCount.substr(0, recommendCount.lastIndexOf("推荐"));

        console.log("recommendCount", recommendCount);

        var commentCount = $(footer).find(".right-info > div:nth-child(3) > em").text().trim();
        commentCount = commentCount.substr(0, commentCount.lastIndexOf("评论"));

        console.log("recommendCount", recommendCount);

        // 总体概况
        console.log(`一共解析出${atricles.length}篇文章,正在解析第${i+1}篇,标题: ${titile} 阅读量: ${readCount} 推荐量: ${recommendCount} 评论数: ${commentCount}`);
    }
}