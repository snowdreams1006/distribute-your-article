var fs = require('fs');
var moment = require('moment');
var request = require('request');
var cheerio = require('cheerio');

// 日期格式化
moment.locale('zh-cn');
var now = moment();

// 读取自定义 cookie
var cookie = readCookie('imooc');

// 请求参数
var requestConfig = {
    url: "https://www.imooc.com/u/index/articles",
    method: 'GET',
    qs: {
        "page": 1
    },
    headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",
        "Cookie": cookie
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
 * 同步访问首页(自定义 cookie)
 * 
 * 渲染流程:分页渲染页面,头尾自动防溢出
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
    // 已经登录应该停留在手记页面,尚未登录则跳转到登录页面
    var usernameInfo = $("#main .user-info .user-name>span");
    var loginFlag = usernameInfo && usernameInfo.text();
    return loginFlag;
}

/**
 *  解析分页总数
 * @param {html} body 
 */
function parsePagenationTotal(body) {
    // 解析尾页
    var $ = cheerio.load(body);
    var lastPage = ($("#pagenation .page a:nth-last-child(3)").text().trim() * 1) || 1;

    return lastPage;
}

/**
 * 解析全部分页数据
 */
async function parseAllPagenationData(total) {
    for (var i = 1; i <= total; i++) {
        requestConfig.qs = {
            "page": i
        };

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
 *  解析当前页
 * @param {html} body
 */
function parseCurrentPagenationData(body) {
    var $ = cheerio.load(body);
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
        console.log(`当前页面解析中,一共${atricles.length}篇文章,正在解析第${i + 1}篇,标题: ${titile} 阅读量: ${readCount} 推荐量: ${recommendCount} 评论数: ${commentCount}`);
    }

    // 当前页解析完毕
    console.log();
    console.log(`当前页面解析完毕,一共${result.atricles.length}篇文章, 阅读量: ${result.readCount} 推荐量: ${result.recommendCount} 评论数: ${result.commentCount}`);
    console.log();
}