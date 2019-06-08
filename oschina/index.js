var fs = require("fs");
var request = require("request");
var cheerio = require("cheerio");
var CryptoJS = require("crypto-js");

// 登陆用户邮箱和密码
var userInfo = {
    email: "snowdreams1006@163.com",
    pwd: "******",
};

// 先登录再访问首页
// login();

// 读取自定义 cookie
var cookie = readCookie();
cookie = JSON.parse(cookie);

console.log("cookie", cookie.oschina);

// 模拟登录直接访问首页
indexWithCookie();

/**
 * 登录
 */
function login() {
    request.post({
        url: "https://www.oschina.net/action/user/hash_login",
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
        },
        form: {
            email: userInfo.email,
            pwd: CryptoJS.SHA1(userInfo.pwd).toString(),
            verifyCode: "",
            save_login: 1,
        },
        jar: true
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {

            // 访问个人空间首页
            index();
        } else {
            console.error("登录失败", error);
        }
    });
}

/**
 * 访问首页
 */
function index() {
    request.get({
        url: "https://my.oschina.net/snowdreams1006",
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
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
 * 读取 cookie(自定义 cookie)
 */
function readCookie() {
    return fs.readFileSync("../.config").toString();
}

/**
 *  解析首页
 * @param {html} body 
 */
function parseIndex(body) {
    var $ = cheerio.load(body);

    // 已经登录会出现设置资料按钮,尚未登录不会出现
    var settingBtn = $("#mainScreen .user-info a.setting-btn");

    var loginFlag = settingBtn && settingBtn.text();
    if (loginFlag) {
        console.log("已经登录: " + settingBtn.text() + "->" + settingBtn.attr("href"));
    } else {
        console.log("尚未登录: " + body);
    }

    // 解析文章基本信息
    var atricles = $("#newestBlogList div.blog-item");
    for (var i = 0; i < atricles.length; i++) {
        var article = atricles[i];

        var header = $(article).find("a.header");
        var body = $(article).find("div.description");
        var footer = $(article).find("div.extra");

        // 标题以及链接
        var titile = header.text().replace(/[原荐顶\s]/g, "");
        var href = header.attr("href");

        console.log("titile", titile);
        console.log("href", href);

        // 内容概要
        var content = $(body).find("p.line-clamp").text();

        console.log("content", content);

        // 阅读量以及评论量
        var readCount = $(footer).find(".eye").parent().text().trim();
        console.log("readCount", readCount);

        var commentCount = $(footer).find(".comment").parent().text().trim();
        console.log("commentCount", commentCount);

        // 总体概况
        console.log(`一共解析出${atricles.length}篇文章,正在解析第${i+1}篇,标题: ${titile} 阅读量: ${readCount} 评论数: ${commentCount}`);
    }
}

/**
 * 访问首页(自定义 cookie)
 */
function indexWithCookie() {
    request.get({
        url: "https://my.oschina.net/snowdreams1006",
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",
            "Cookie": cookie.oschina
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