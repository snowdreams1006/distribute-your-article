var fs = require('fs');
var moment = require('moment');
var request = require('request');
var cheerio = require('cheerio');

// 日期格式化
moment.locale('zh-cn');
var now = moment();

// 读取自定义 cookie
var cookie = readCookie('csdn');

// 请求参数
var requestConfig = {
    url: "https://blog.csdn.net/weixin_38171180",
    method: 'GET',
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
 * 同步访问首页(自定义 cookie)
 * 
 * 渲染流程:分页渲染页面,超过最大分页时报错
 */
async function indexWithCookie() {
    try {
        // 解析首页数据
        var indexHtml = await parseIndexHtml();

        // 首页页面保存到本地
        fs.writeFileSync(`./data/${now.format("YYYY-MM-DD")}.html`, indexHtml);
        console.log(`首页已经保存至 ./data/${now.format("YYYY-MM-DD")}.html 如需查看,建议断网访问.`);

        // 解析分页总数
        var total = parsePagenationTotal(indexHtml);

        // 解析全部分页数据
        await parseAllPagenationData(total);

        // 统计数据保存到本地
        fs.writeFileSync(`./data/${now.format("YYYY-MM-DD")}.json`, JSON.stringify(result));
        console.log(`统计数据已经保存至 ./data/${now.format("YYYY-MM-DD")}.json`);

        // 计算总耗时
        console.log();
        var endTime = moment();
        var duringTime = endTime.diff(now, 'seconds', true);
        console.log(`${now.format("YYYY-MM-DD HH:mm:ss")} ~ ${endTime.format("YYYY-MM-DD HH:mm:ss")} 共耗时 ${duringTime} 秒`);
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

    return body;
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
    var $ = cheerio.load(body);
    // 已经登录不会出现关注按钮,尚未登录会出现
    var userAttention = $("#btnAttent");
    var nologinFlag = userAttention && userAttention.text();
    return !nologinFlag;
}

/**
 *  解析分页总数
 * @param {html} body 
 */
function parsePagenationTotal(body) {
    // 解析尾页
    var $ = cheerio.load(body);
    var lastPage = ($("#pageBox li.js-page-next.ui-pager").prev().text().trim()) * 1 || 1;

    return lastPage;
}

/**
 * 解析全部分页数据
 */
async function parseAllPagenationData(total) {
    for (var i = 1; i <= total; i++) {
        requestConfig.url = `https://blog.csdn.net/weixin_38171180/article/list/${i}`

        // 依次分页查询
        var body = await syncRequest(requestConfig);

        // 解析当前分页数据
        parseCurrentPagenationData(body);

        // 数据保存到本地
        fs.writeFileSync(`./data/${now.format("YYYY-MM-DD")}[${i}].html`, body);
        console.log(`分页数据已经保存至 ./data/${now.format("YYYY-MM-DD")}[${i}].html`);
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
 *  是否是最大页码
 * @param {html} $ 
 */
function isTotal($) {
    // 若超过最大页码,激活选项卡是动态而不是文章
    return $(".article-list") && !$(".article-list").html();
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
        console.log(`当前页面解析中,一共${atricles.length}篇文章,正在解析第${i + 1}篇,标题: ${titile} 阅读数: ${readCount} 评论数: ${commentCount}`);
    }

    // 当前页解析完毕
    console.log();
    console.log(`当前页面解析完毕,一共${result.atricles.length}篇文章, 阅读数: ${result.readCount} 评论数: ${result.commentCount}`);
    console.log();
}