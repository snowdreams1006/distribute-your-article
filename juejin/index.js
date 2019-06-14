var fs = require("fs");
var request = require("request");
var cheerio = require("cheerio");

// 读取自定义 cookie
var cookie = readCookie();
cookie = JSON.parse(cookie);

console.log("cookie", cookie.juejin);

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
        url: "https://juejin.im/user/582d5cb667f356006331e586/posts",
        
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",
            "Cookie": cookie.juejin
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
    var settingBtn = $("#juejin div.user-info-block > div.action-box > button.setting-btn");

    var loginFlag = settingBtn && settingBtn.text();
    if (loginFlag) {
        console.log("已经登录: " + settingBtn.text());
    } else {
        console.log("尚未登录: " + body);
    }
}