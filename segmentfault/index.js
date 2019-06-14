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

console.log("cookie", cookie.segmentfault);

// 请求参数
var requestConfig = {
    url: "https://segmentfault.com/blog/snowdreams1006",
    qs: {
        "page": 1
    },
    headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",
        "Cookie": cookie.segmentfault
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
        url: "https://segmentfault.com/blog/snowdreams1006",
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",
            "Cookie": cookie.segmentfault
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
    var userAvatar = $("body > div.global-nav.sf-header.sf-header--index > nav > div.row.hidden-xs.hidden-sm > div.col-sm-4.col-md-3.col-lg-3.text-right > ul > li.opts__item.user.dropdown.hoverDropdown.ml0 > a");

    var loginFlag = userAvatar && userAvatar.attr("src");
    if (loginFlag) {
        console.log("已经登录: " + userAvatar.attr("src"));
    } else {
        console.log("尚未登录: " + body);
    }

    // 解析文章基本信息
    var atricles = $(".stream-list section.stream-list__item");
    for (var i = 0; i < atricles.length; i++) {
        var article = atricles[i];

        var title = $(article).find(".summary .title a").text().trim();
        var content = $(article).find(".summary p.excerpt").text();
        var collectCount = $(article).find(".summary .news__bookmark-text").text();
        collectCount = collectCount.substr(0, collectCount.indexOf(" ")) || 0;

        // 总体概况
        console.log(`一共解析出${atricles.length}篇文章,正在解析第${i+1}篇,标题: ${title} 收藏量: ${collectCount}`);
    }
}