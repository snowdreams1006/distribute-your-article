var fs = require("fs");
var request = require("request");
var cheerio = require("cheerio");

// 读取自定义 cookie
var cookie = readCookie();
cookie = JSON.parse(cookie);

console.log("cookie", cookie.cnblogs);

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
        url: "https://i.cnblogs.com/",
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",
            "Cookie": cookie.cnblogs
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

    // 已经登录会出现后台管理页面,尚未登录则会自动跳转登录页面
    var userBlog = $("#blog_title > a");

    var loginFlag = userBlog && userBlog.attr("href");
    if (loginFlag) {
        console.log("已经登录: " + userBlog.attr("href"));
    } else {
        console.log("尚未登录: " + body);
    }

    // 解析文章基本信息
    var atricles = $("#post_list tr");
    for (var i = 1; i < atricles.length; i++) {
        var article = atricles[i];

        // 标题以及链接
        var titile = $(article).find("td:nth-child(1) a").text().trim();
        var href = $(article).find("td:nth-child(1) a").attr("href");

        console.log("titile", titile);
        console.log("href", href);

        // 评论数和阅读数
        var commentCount = $(article).find("td:nth-child(3)").text().trim();
        
        console.log("commentCount", commentCount);

        var readCount = $(article).find("td:nth-child(4)").text().trim();

        console.log("readCount", readCount);

        // 总体概况
        console.log(`一共解析出${atricles.length}篇文章,正在解析第${i+1}篇,标题: ${titile} 评论数: ${commentCount} 阅读数: ${readCount}`);
    }
}