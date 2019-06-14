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

console.log("cookie", cookie.cnblogs);

// 请求参数
var requestConfig = {
    url: "https://i.cnblogs.com/posts",
    qs: {
        "page": 1
    },
    headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",
        "Cookie": cookie.cnblogs
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
    // 已经登录会出现后台管理页面,尚未登录则会自动跳转登录页面
    var userBlog = $("#blog_title > a");

    var loginFlag = userBlog && userBlog.attr("href");
    if (loginFlag) {
        console.log("已经登录: " + userBlog.attr("href"));

        return true;
    } else {
        console.log("尚未登录: " + body);

        return false;
    }
}

/**
 *  解析分页
 * @param {html} body 
 */
function parsePagenation($) {
    // 解析尾页
    var lastPage = ($("#content_area > div.pager").children("a").last().prev().text().trim())* 1 || 1;

    return lastPage;
}

/**
 *  解析当前页
 * @param {html} body 
 */
function parseCurrent($) {
    // 解析文章基本信息
    var atricles = $("#post_list tr");
    for (var i = 1; i < atricles.length; i++) {
        var article = atricles[i];

        // 标题以及链接
        var titile = $(article).find("td:nth-child(1) a").text().trim();
        var href = $(article).find("td:nth-child(1) a").attr("href");
        // 评论数和阅读数
        var commentCount = ($(article).find("td:nth-child(3)").text().trim()) * 1;
        var readCount = ($(article).find("td:nth-child(4)").text().trim()) * 1;

        // 文章汇总数据
        result.atricles.push({
            "titile": titile,
            "href": href
        });
        result.commentCount += commentCount;
        result.readCount += readCount;

        // 总体概况
        console.log(`一共解析出${atricles.length}篇文章,正在解析第${i+1}篇,标题: ${titile} 评论数: ${commentCount} 阅读数: ${readCount}`);
    }

    // 当前页解析完毕
    console.log();
    console.log(`当前页面解析完毕,一共${result.atricles.length}篇文章, 评论数: ${result.commentCount} 阅读数: ${result.readCount}`);
    console.log();
}