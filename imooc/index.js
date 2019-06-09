var fs = require("fs");
var request = require("request");
var cheerio = require("cheerio");

// 读取自定义 cookie
var cookie = readCookie();
cookie = JSON.parse(cookie);

console.log("cookie", cookie.imooc);

// 请求参数
var requestConfig = {
    url: "https://www.imooc.com/u/index/articles",
    qs: {
        "page": 1
    },
    headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",
        "Cookie": cookie.imooc
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

        var body = await syncRequest(requestConfig);

        parseCurrent(cheerio.load(body));
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
    // 已经登录应该停留在手记页面,尚未登录则跳转到登录页面
    var usernameInfo = $("#main .user-info .user-name>span");

    var loginFlag = usernameInfo && usernameInfo.text();
    if (loginFlag) {
        console.log("已经登录: " + usernameInfo.text());

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
    // 解析当前页以及尾页
    var currentPage = $("#pagenation .page a.active.text-page-tag").text().trim() * 1;
    var lastPage = $("#pagenation .page a:nth-child(8)").attr("href");
    lastPage = (lastPage && (lastPage.substr(lastPage.lastIndexOf("=") + 1)) * 1) || currentPage;
    
    return lastPage;
}

/**
 *  解析当前页
 * @param {html} body 
 */
function parseCurrent($) {
    // 解析当前页
    var atricles = $("#articlesList div.article-item");
    for (var i = 0; i < atricles.length; i++) {
        var article = atricles[i];

        var header = $(article).find("h3.item-title");
        var body = $(article).find("div.item-txt");
        var footer = $(article).find("div.item-btm");

        // 标题以及链接
        var titile = $(header).find("a.title-detail").text().trim();
        var href = $(header).find("a.title-detail").attr("href");
        // 内容概要
        var content = $(body).find("p.item-bd").text()
        // 阅读量,推荐量以及评论量
        var readCount = $(footer).find(".right-info > div:nth-child(1) > em").text().trim();
        readCount = (readCount.substr(0, readCount.lastIndexOf("浏览"))) * 1
        var recommendCount = $(footer).find(".right-info > div:nth-child(2) > em").text().trim();
        recommendCount = (recommendCount.substr(0, recommendCount.lastIndexOf("推荐"))) * 1;
        var commentCount = $(footer).find(".right-info > div:nth-child(3) > em").text().trim();
        commentCount = (commentCount.substr(0, commentCount.lastIndexOf("评论"))) * 1;

        // 文章汇总数据
        result.atricles.push({
            "titile": titile,
            "href": href,
            "content": content
        });
        result.readCount += readCount;
        result.recommendCount += recommendCount;
        result.commentCount += commentCount;

        // 当前页正在解析中
        console.log(`当前页面解析中,一共${atricles.length}篇文章,正在解析第${i+1}篇,标题: ${titile} 阅读量: ${readCount} 推荐量: ${recommendCount} 评论数: ${commentCount}`);
    }

    // 当前页正在解析中
    console.log(`当前页面解析完毕,一共${result.atricles.length}篇文章, 阅读量: ${result.readCount} 推荐量: ${result.recommendCount} 评论数: ${result.commentCount}`);
}