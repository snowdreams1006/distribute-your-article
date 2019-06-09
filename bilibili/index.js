var fs = require("fs");
var request = require("request");
var cheerio = require("cheerio");

// 读取自定义 cookie
var cookie = readCookie();
cookie = JSON.parse(cookie);

console.log("cookie", cookie.bilibili);

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
        url: "https://member.bilibili.com/v2?spm_id_from=333.33.b_73656375726974794f75744c696e6b.3#/upload-manager/text",
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",
            "Cookie": cookie.bilibili
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
    var userAvatar = $("#app > div.cc-header > div > div > div.nav-wrapper.clearfix.bili-wrapper > div.nav-con.fr > ul > li.nav-item.profile-info > a");

    var loginFlag = userAvatar && userAvatar.attr("href");
    if (loginFlag) {
        console.log("已经登录: " + userAvatar.attr("href"));
    } else {
        console.log("尚未登录: " + body);
    }

    // // 解析文章基本信息
    // var atricles = $("#list-container li");
    // for (var i = 0; i < atricles.length; i++) {
    //     var article = atricles[i];

    //     var header = $(article).find("a.title");
    //     var body = $(article).find("p.abstract");
    //     var footer = $(article).find("div.meta");

    //     // 标题以及链接
    //     var titile = $(header).text().trim();
    //     var href = $(header).attr("href");

    //     console.log("titile", titile);
    //     console.log("href", href);

    //     // 内容概要
    //     var content = $(body).text();

    //     console.log("content", content);

    //     // 阅读量,评论量以及喜欢
    //     var readCount = $(footer).find(".ic-list-read").parent().text().trim();

    //     console.log("readCount", readCount);

    //     var commentCount = $(footer).find(".ic-list-comments").parent().text().trim();
        
    //     console.log("commentCount", commentCount);

    //     var recommendCount = $(footer).find(".ic-list-like").parent().text().trim();
        
    //     console.log("recommendCount", recommendCount);

    //     // 总体概况
    //     console.log(`一共解析出${atricles.length}篇文章,正在解析第${i+1}篇,标题: ${titile} 阅读量: ${readCount} 评论数: ${commentCount} 喜欢数: ${recommendCount}`);
    // }
}