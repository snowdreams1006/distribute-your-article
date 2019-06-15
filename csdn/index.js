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
        // 解析出分页总数,依次遍历访问累加
        var total = await parsePagenation();
        for (var i = 1; i <= total; i++) {
            requestConfig.url = `https://blog.csdn.net/weixin_38171180/article/list/${i}`

            var body = await syncRequest(requestConfig);

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
 * 解析分页
 */
async function parsePagenation() {
    // 累加访问获取最大分页数据
    var total = 1;
    while (true) {
        requestConfig.url = `https://blog.csdn.net/weixin_38171180/article/list/${total}`

        var body = await syncRequest(requestConfig);
        var $ = cheerio.load(body);
        if (!isLogin($)) {
            return console.error("尚未登录,cookie 可能已失效!");
        }
        if (isTotal($)) {
            break;
        }
        total++;
    }
    // 最大页码时不该越界
    total -= 1;

    return total;
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
 *  是否是最大页码
 * @param {html} $ 
 */
function isTotal($) {
    // 若超过最大页码,激活选项卡是动态而不是文章
    return $(".article-list") && !$(".article-list").html();
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
 *  解析当前页
 * @param {html} body 
 */
function parseCurrent($) {
    // 解析当前页
    var atricles = $(".article-list div.article-item-box");
    for (var i = 0; i < atricles.length; i++) {
        var article = atricles[i];

        var header = $(article).find("h4");
        var body = $(article).find("p.content");
        var footer = $(article).find("div.info-box");

        // 标题以及链接
        var titile = $(header).find("a").text().trim().replace(/[\s]/g, "").replace(/[原转译]/, "");
        var href = $(header).find("a").attr("href");
        var content = $(body).find("a").text().trim();

        // 过滤无效文章
        if ("帝都的凛冬" == titile) {
            continue;
        }

        // 阅读数和评论量
        var readCount = ($(footer).find("p:nth-child(3) > span > span").text().trim()) * 1;
        var commentCount = ($(footer).find("p:nth-child(5) > span > span").text().trim()) * 1;

        // 文章汇总数据
        result.atricles.push({
            "titile": titile,
            "href": href,
            "content": content
        });
        result.readCount += readCount;
        result.commentCount += commentCount;

        // 当前页正在解析中
        console.log(`当前页面解析中,一共${atricles.length}篇文章,正在解析第${i+1}篇,标题: ${titile} 阅读数: ${readCount} 评论数: ${commentCount}`);
    }

    // 当前页解析完毕
    console.log();
    console.log(`当前页面解析完毕,一共${result.atricles.length}篇文章, 阅读数: ${result.readCount} 评论数: ${result.commentCount}`);
    console.log();
}