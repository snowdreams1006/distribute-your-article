var fs = require('fs');
var moment = require('moment');
var request = require('request');
var cheerio = require('cheerio');

// 日期格式化
moment.locale('zh-cn');
var now = moment();

// 读取自定义 cookie
var cookie = readCookie('cloud-tencent');

// 请求参数
var requestConfig = {
    url: 'https://cloud.tencent.com/developer/user/2952369/activities',
    method: 'GET',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
        'Cookie': cookie
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
function readCookie(cookieKey) {
    var cookie = fs.readFileSync("../.config").toString();
    cookie = JSON.parse(cookie);
    return cookie[cookieKey];
}

/**
 * 同步访问首页
 * 
 * 渲染流程:初次整体渲染,随后ajax异步加载
 */
async function indexWithCookie() {
    try {
        // 解析首页数据
        await parseIndexHtml();

        // 解析出分页总数,依次遍历访问累加
        var total = await parsePagenation();
        for (var i = 1; i <= total; i++) {
            //默认规则分页查询
            requestConfig.url = "https://cloud.tencent.com/developer/services/ajax/user-center";
            requestConfig.method = "POST";
            requestConfig.json = true;
            requestConfig.qs = {
                "action": "GetUserActivities",
                "uin": "100005824907",
                "csrfCode": "502094663"
            };
            requestConfig.body = {
                "action": "GetUserActivities",
                "payload": {
                    "uid": 2952369,
                    "pageNumber": i
                }
            };

            var body = await syncRequest(requestConfig);

            // 数据保存到本地
            fs.writeFileSync(`./data/${now.format("YYYY-MM-DD")}[${i}].json`, JSON.stringify(body));

            parseCurrent(body);
        }

        // 数据保存到本地
        fs.writeFileSync(`./data/${now.format("YYYY-MM-DD")}.json`, JSON.stringify(result));

    } catch (error) {
        console.error("error", error);
    }
}

/**
 * 解析首页
 */
async function parseIndexHtml() {
    // 初次访问解析出分页总数,并不计数
    var body = await syncRequest(requestConfig);

    // 判断是否登录
    var loginFlag = isLogin(body);
    console.log(loginFlag ? '已经登录' : '尚未登录');

    // 数据保存到本地
    fs.writeFileSync(`./data/${now.format("YYYY-MM-DD")}.html`, body);
    console.log(`首页已经保存至 ./data/${now.format("YYYY-MM-DD")}.html 如需查看,建议断网访问.`);
}

/**
 *  模拟同步请求
 * 
 * @param {object} options 请求参数
 */
function syncRequest(options) {
    return new Promise(function (resolve, reject) {
        request(options, function (error, response, body) {
            if (error) {
                reject(error);
            } else {
                resolve(body);
            }
        });
    });
}

/**
 *  是否已登录
 * 
 * @param {html} body 页面内容
 */
function isLogin(body) {
    // 已经登录会出现用户个人头像,否则不出现
    var $ = cheerio.load(body);
    var userAvatar = $("#react-root > div:nth-child(1) > div.J-header.c-nav-wrap.c-nav.com-2-nav.c-nav-air-sub > div > div.J-headerBottom.c-nav-bottom.responsive > div.J-headerBottomRight.c-nav-bm-right > div:nth-child(4) > a");
    var loginFlag = userAvatar && userAvatar.attr("href");
    return loginFlag;
}

/**
 * 解析分页
 */
async function parsePagenation() {
    // 累加访问获取最大分页数据
    var total = 1;
    while (true) {
        //默认规则分页查询
        requestConfig.url = "https://cloud.tencent.com/developer/services/ajax/user-center";
        requestConfig.method = "POST";
        requestConfig.json = true;
        requestConfig.qs = {
            "action": "GetUserActivities",
            "uin": "100005824907",
            "csrfCode": "502094663"
        };
        requestConfig.body = {
            "action": "GetUserActivities",
            "payload": {
                "uid": 2952369,
                "pageNumber": total
            }
        };

        var body = await syncRequest(requestConfig);
        if (isTotal(body)) {
            break;
        }
        total++;
    }
    // 最大页码时不该越界
    total -= 1;

    return total;
}



/**
 *  是否是最大页码
 * @param {html} $ 
 */
function isTotal(body) {
    // 超过分页请求,list 列表为空
    return body.code == 0 && body.data.list.length == 0;
}



/**
 *  解析首页
 * @param {html} body 
 */
function parseCurrent(body) {
    // 解析文章基本信息
    if (body.code == 0 && body.data.list.length > 0) {
        var atricles = body.data.list;
        for (var i = 0; i < atricles.length; i++) {
            var article = atricles[i].detail;

            // 标题以及链接
            var title = article.title;
            var href = "https://cloud.tencent.com/developer/article/" + article.articleId;
            var content = article.content;

            // 最后一篇是个人简介
            if (!title) {
                continue;
            }

            // 阅读量,评论量以及喜欢
            var readCount = article.viewCount;
            var commentCount = article.commentCount;
            var recommendCount = article.likeCount;

            // 文章汇总数据
            result.atricles.push({
                "title": title,
                "href": href,
                "content": content
            });
            result.readCount += readCount;
            result.recommendCount += recommendCount;
            result.commentCount += commentCount;

            // 当前页正在解析中
            console.log(`当前页面解析中,一共${atricles.length}篇文章,正在解析第${i + 1}篇,标题: ${title} 阅读量: ${readCount} 点赞数: ${recommendCount} 评论数: ${commentCount}`);
        }
    }

    // 当前页解析完毕
    console.log();
    console.log(`当前页面解析完毕,一共${result.atricles.length}篇文章, 阅读量: ${result.readCount} 点赞数: ${result.recommendCount} 评论数: ${result.commentCount}`);
    console.log();
}

/**
 *  解析首页
 * @param {html} body 
 */
function parseIndex2(body) {
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
        console.log(`一共解析出${atricles.length}篇文章,正在解析第${i + 1}篇,标题: ${titile} 阅读量: ${readCount} 点赞量: ${recommendCount}`);
    }
}