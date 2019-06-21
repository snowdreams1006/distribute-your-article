var fs = require('fs');
var moment = require('moment');
var request = require('request');
var cheerio = require('cheerio');

// 日期格式化
moment.locale('zh-cn');
var now = moment();

// 读取自定义 cookie
var cookie = readCookie('segmentfault');

// 请求参数
var requestConfig = {
    url: 'https://segmentfault.com/blog/snowdreams1006',
    method: 'GET',
    qs: {
        'page': 1
    },
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
        'Cookie': cookie
    },
    jar: true
};

// 解析结果
var result = {
    atricles: [],
    collectCount: 0
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
    // 已经登录会出现用户个人头像,否则不出现
    var userAvatar = $("body > div.global-nav.sf-header.sf-header--index > nav > div.row.hidden-xs.hidden-sm > div.col-sm-4.col-md-3.col-lg-3.text-right > ul > li.opts__item.user.dropdown.hoverDropdown.ml0 > a");
    var loginFlag = userAvatar && userAvatar.attr("src");
    return loginFlag;
}

/**
 *  解析分页总数
 * @param {html} body 
 */
function parsePagenationTotal(body) {
    // 解析尾页
    var $ = cheerio.load(body);
    var lastPage = ($("ul.pagination").children("li").last().prev().find("a").text().trim()) * 1 || 1;

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
 *  解析首页
 * @param {html} body 
 */
function parseCurrentPagenationData(body) {
    var $ = cheerio.load(body);
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