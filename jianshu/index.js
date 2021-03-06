var fs = require('fs');
var moment = require('moment');
var request = require('request');
var cheerio = require('cheerio');

// 日期格式化
moment.locale('zh-cn');
var now = moment();

// 读取自定义 cookie
var cookie = readCookie('jianshu');

// 请求参数
var requestConfig = {
    url: "https://www.jianshu.com/u/577b0d76ab87",
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
 * 渲染流程:初次整体渲染,随后ajax异步加载
 */
async function indexWithCookie() {
    try {
        // 解析首页数据
        var indexHtml = await parseIndexHtml();

        // 首页页面保存到本地
        fs.writeFileSync(`./data/${now.format("YYYY-MM-DD")}.html`, indexHtml);
        console.log(`首页已经保存至 ./data/${now.format("YYYY-MM-DD")}.html 如需查看,建议断网访问.`);

        // 解析全部分页数据
        await parseAllPagenationData();

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
    // 已经登录会出现用户个人头像,否则不出现
    var $ = cheerio.load(body);
    var userAvatar = $(".user a.avatar");
    var loginFlag = userAvatar && userAvatar.attr("href");
    return loginFlag;
}

/**
 * 解析全部分页数据
 */
async function parseAllPagenationData() {
    // 累加访问获取最大分页数据
    var currentPage = 1;
    while (true) {
        requestConfig.qs = {
            "page": currentPage
        };

        // 依次分页查询
        var body = await syncRequest(requestConfig);
        if (isReachLimitTotal(body)) {
            break;
        }

        // 解析当前分页数据
        parseCurrentPagenationData(body);

        // 当前分页数据保存到本地
        fs.writeFileSync(`./data/${now.format("YYYY-MM-DD")}[${currentPage}].html`, body);
        console.log(`分页数据已经保存至 ./data/${now.format("YYYY-MM-DD")}[${currentPage}].html`);

        currentPage++;
    }
}

/**
 *  是否达到最大分页请求
 * 
 * @param {object} body 
 */
function isReachLimitTotal(body) {
    var $ = cheerio.load(body);
    // 若超过最大页码,激活选项卡是动态而不是文章
    return $("#outer-container > ul > li.active > a").attr("href") == "/users/577b0d76ab87/timeline";
}

/**
 *  解析首页
 * @param {html} body 
 */
function parseCurrentPagenationData(body) {
    var $ = cheerio.load(body);
    // 解析文章基本信息
    var atricles = $("#list-container li");
    for (var i = 0; i < atricles.length; i++) {
        var article = atricles[i];

        var header = $(article).find("a.title");
        var body = $(article).find("p.abstract");
        var footer = $(article).find("div.meta");

        // 标题以及链接
        var titile = $(header).text().trim();
        var href = $(header).attr("href");
        // 内容概要
        var content = $(body).text();
        // 阅读量,评论量以及喜欢
        var readCount = ($(footer).find(".ic-list-read").parent().text().trim()) * 1;
        var commentCount = ($(footer).find(".ic-list-comments").parent().text().trim()) * 1;
        var recommendCount = ($(footer).find(".ic-list-like").parent().text().trim()) * 1;

        // 文章汇总数据
        result.atricles.push({
            "titile": titile,
            "href": href,
            "content": content
        });
        result.readCount += readCount;
        result.commentCount += commentCount;
        result.recommendCount += recommendCount;

        // 当前页正在解析中
        console.log(`当前页面解析中,一共${atricles.length}篇文章,正在解析第${i + 1}篇,标题: ${titile} 阅读量: ${readCount} 评论数: ${commentCount} 喜欢数: ${recommendCount}`);
    }

    // 当前页解析完毕
    console.log();
    console.log(`当前页面解析完毕,一共${result.atricles.length}篇文章, 阅读量: ${result.readCount} 评论数: ${result.commentCount} 喜欢数: ${result.recommendCount}`);
    console.log();
}