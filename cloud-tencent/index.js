var fs = require("fs");
var request = require("request");
var cheerio = require("cheerio");

// 读取自定义 cookie
var cookie = readCookie();
cookie = JSON.parse(cookie);

console.log("cookie", cookie["cloud-tencent"]);

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
        url: "https://cloud.tencent.com/developer/user/2952369/activities",
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",
            "Cookie": cookie["cloud-tencent"]
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

    // 已经登录会出现用户个人头像,否则不出现
    var userAvatar = $("#react-root > div:nth-child(1) > div.J-header.c-nav-wrap.c-nav.com-2-nav.c-nav-air-sub > div > div.J-headerBottom.c-nav-bottom.responsive > div.J-headerBottomRight.c-nav-bm-right > div:nth-child(4) > a");

    var loginFlag = userAvatar && userAvatar.attr("href");
    if (loginFlag) {
        console.log("已经登录: " + userAvatar.attr("href"));
    } else {
        console.log("尚未登录: " + body);
    }

    // 解析文章基本信息
    var atricles = $(".com-log-list .com-log-panel");
    for (var i = 0; i < atricles.length; i++) {
        var article = atricles[i];

        var header = $(article).find(".com-article-panel-title a");
        var readCount = $(article).find(".com-i-view").next().text().trim();
        var recommendCount = $(article).find(".com-i-like").next().text().trim();

        // 标题以及链接
        var titile = $(header).text().trim();
        var href = $(header).attr("href");

        console.log("titile", titile);
        console.log("href", href);
        console.log("readCount", readCount);
        console.log("recommendCount", recommendCount);

        // 总体概况
        console.log(`一共解析出${atricles.length}篇文章,正在解析第${i+1}篇,标题: ${titile} 阅读量: ${readCount} 点赞量: ${recommendCount}`);
    }
}