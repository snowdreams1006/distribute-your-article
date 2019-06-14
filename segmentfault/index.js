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
    collectCount: 0
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
        // 访问首页,解析出分页总数,依次遍历累加
        requestConfig.qs = {
            "page": 1
        };

        // 初次访问解析出分页总数,并不计数
        var body = await syncRequest(requestConfig);

        // 解析出分页总数,依次遍历访问累加
        var total = parseIndex(body);
        for (var i = 1; i <= total; i++) {
            requestConfig.qs = {
                "page": i
            };

            body = await syncRequest(requestConfig);

            // 数据保存到本地
            fs.writeFileSync(`./data/${now.format("YYYY-MM-DD")}[${i}].html`, body);

            parseCurrent(cheerio.load(body));
        }

        // 数据保存到本地
        fs.writeFileSync(`./data/${now.format("YYYY-MM-DD")}.json`, JSON.stringify(result));

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
    // 已经登录会出现用户个人头像,否则不出现
    var userAvatar = $("body > div.global-nav.sf-header.sf-header--index > nav > div.row.hidden-xs.hidden-sm > div.col-sm-4.col-md-3.col-lg-3.text-right > ul > li.opts__item.user.dropdown.hoverDropdown.ml0 > a");

    var loginFlag = userAvatar && userAvatar.attr("src");
    if (loginFlag) {
        console.log("已经登录: " + userAvatar.attr("src"));

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
    var lastPage = ($("ul.pagination").children("li").last().prev().find("a").text().trim()) * 1 || 1;

    return lastPage;
}

/**
 *  解析首页
 * @param {html} body 
 */
function parseCurrent($) {
    // 解析文章基本信息
    var atricles = $(".stream-list section.stream-list__item");
    for (var i = 0; i < atricles.length; i++) {
        var article = atricles[i];

        var title = $(article).find(".summary .title a").text().trim();
        var href = $(article).find(".summary .title a").attr("href");
        var content = $(article).find(".summary p.excerpt").text();

        var collectCount = $(article).find(".summary .news__bookmark-text").text();
        collectCount = (collectCount.substr(0, collectCount.indexOf(" "))) * 1;

        // 文章汇总数据
        result.atricles.push({
            "title": title,
            "href": href,
            "content": content
        });
        result.collectCount += collectCount;

        // 总体概况
        console.log(`一共解析出${atricles.length}篇文章,正在解析第${i+1}篇,标题: ${title} 收藏量: ${collectCount}`);
    }

    // 当前页解析完毕
    console.log();
    console.log(`当前页面解析完毕,一共${result.atricles.length}篇文章, 收藏量: ${result.collectCount}`);
    console.log();
}