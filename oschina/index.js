var fs = require("fs");
var moment = require("moment");
var request = require("request");
var cheerio = require("cheerio");
var CryptoJS = require("crypto-js");

// 日期格式化
moment.locale("zh-cn");
var now = moment();

// 读取自定义 cookie
var cookie = readCookie();
cookie = JSON.parse(cookie);

console.log("cookie", cookie.oschina);

// 请求参数
var requestConfig = {
    url: "https://my.oschina.net/snowdreams1006",
    qs: {

    },
    headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",
        "Cookie": cookie.oschina
    },
    jar: true
};

// 解析结果
var result = {
    atricles: [],
    readCount: 0,
    commentCount: 0
};

// 登陆用户邮箱和密码
var userInfo = {
    email: "snowdreams1006@163.com",
    pwd: "******",
};

// 先登录再访问首页
// login();

// 模拟登录直接访问首页
indexWithCookie(requestConfig);

/**
 * 登录
 */
function login() {
    request.post({
        url: "https://www.oschina.net/action/user/hash_login",
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
        },
        form: {
            email: userInfo.email,
            pwd: CryptoJS.SHA1(userInfo.pwd).toString(),
            verifyCode: "",
            save_login: 1,
        },
        jar: true
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {

            // 访问个人空间首页
            index();
        } else {
            console.error("登录失败", error);
        }
    });
}

/**
 * 访问首页
 */
function index() {
    request.get({
        url: "https://my.oschina.net/snowdreams1006",
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
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
 * 读取 cookie(自定义 cookie)
 */
function readCookie() {
    return fs.readFileSync("../.config").toString();
}

/**
 *  解析首页
 * @param {html} body 
 */
function parseIndex2(body) {
    var $ = cheerio.load(body);

    // 已经登录会出现设置资料按钮,尚未登录不会出现
    var settingBtn = $("#mainScreen .user-info a.setting-btn");

    var loginFlag = settingBtn && settingBtn.text();
    if (loginFlag) {
        console.log("已经登录: " + settingBtn.text() + "->" + settingBtn.attr("href"));
    } else {
        console.log("尚未登录: " + body);
    }

    // 解析文章基本信息
    var atricles = $("#newestBlogList div.blog-item");
    for (var i = 0; i < atricles.length; i++) {
        var article = atricles[i];

        var header = $(article).find("a.header");
        var body = $(article).find("div.description");
        var footer = $(article).find("div.extra");

        // 标题以及链接
        var titile = header.text().replace(/[原荐顶\s]/g, "");
        var href = header.attr("href");

        console.log("titile", titile);
        console.log("href", href);

        // 内容概要
        var content = $(body).find("p.line-clamp").text();

        console.log("content", content);

        // 阅读量以及评论量
        var readCount = $(footer).find(".eye").parent().text().trim();
        console.log("readCount", readCount);

        var commentCount = $(footer).find(".comment").parent().text().trim();
        console.log("commentCount", commentCount);

        // 总体概况
        console.log(`一共解析出${atricles.length}篇文章,正在解析第${i+1}篇,标题: ${titile} 阅读量: ${readCount} 评论数: ${commentCount}`);
    }
}

/**
 * 同步访问首页(自定义 cookie)
 */
async function indexWithCookie(requestConfig) {
    try {
        var body = await syncRequest(requestConfig);

        // 判断是否登录
        isLogin(cheerio.load(body));

        // 解析出分页总数,依次遍历访问累加
        var total = await parsePagenation();
        for (var i = 1; i <= total; i++) {
            //默认规则分页查询
            requestConfig.url = "https://my.oschina.net/snowdreams1006/widgets/_space_index_newest_blog";
            requestConfig.qs = {
                "catalogId": 0,
                "q": "",
                "p": i,
                "type": "ajax"
            };

            var body = await syncRequest(requestConfig);

            // 数据保存到本地
            fs.writeFileSync(`./data/${now.format("YYYY-MM-DD")}-[${i}].html`, body);

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
        //默认规则分页查询
        requestConfig.url = "https://my.oschina.net/snowdreams1006/widgets/_space_index_newest_blog";
        requestConfig.qs = {
            "catalogId": 0,
            "q": "",
            "p": total,
            "type": "ajax"
        };

        var body = await syncRequest(requestConfig);
        if (isTotal(cheerio.load(body))) {
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
    // 若超过最大页码,则不再显示文章列表
    return $(".items .item").length == 0;
}

/**
 *  是否已登录
 * @param {html} $ 
 */
function isLogin($) {
    // 已经登录会出现设置资料按钮,尚未登录不会出现
    var settingBtn = $("#mainScreen .user-info a.setting-btn");

    var loginFlag = settingBtn && settingBtn.text();
    if (loginFlag) {
        console.log("已经登录: " + settingBtn.text() + "->" + settingBtn.attr("href"));

        return true;
    } else {
        console.log("尚未登录");

        return false;
    }
}

/**
 *  解析首页
 * @param {html} body 
 */
function parseCurrent($) {
    // 解析文章基本信息
    var atricles = $(".items .item");
    for (var i = 0; i < atricles.length; i++) {
        var article = atricles[i];

        var header = $(article).find("a.header");
        var body = $(article).find("div.description");
        var footer = $(article).find("div.extra");

        // 标题以及链接
        var title = header.text().replace(/[原荐顶\s]/g, "");
        var href = header.attr("href");
        var content = $(body).find("p.line-clamp").text();

        // 过滤无效文章
        if (!title) {
            continue;
        }

        // 阅读量以及评论量
        var readCount = (numReconvert($(footer).find(".eye").parent().text().trim())) * 1;
        var commentCount = (numReconvert($(footer).find(".comment").parent().text().trim())) * 1;

        // 文章汇总数据
        result.atricles.push({
            "title": title,
            "href": href,
            "content": content
        });
        result.readCount += readCount;
        result.commentCount += commentCount;

        // 当前页正在解析中
        console.log(`当前页面解析中,一共${atricles.length}篇文章,正在解析第${i+1}篇,标题: ${title} 阅读量: ${readCount} 评论数: ${commentCount}`);
    }

    // 当前页解析完毕
    console.log();
    console.log(`当前页面解析完毕,一共${result.atricles.length}篇文章, 阅读量: ${result.readCount} 评论数: ${result.commentCount}`);
    console.log();
}

function numConvert(num){
    if(num>=10000){
      num=Math.round(num/1000)/10+'W';
    }else if(num>=1000){
      num=Math.round(num/100)/10+'K';
    }
    return num;
}

function numReconvert(numStr){
    var unit = numStr.substr(-1);
    var num = numStr;
    if(unit == "W" || unit == "K"){
    num = numStr.substr(0,numStr.indexOf(unit));
    num= parseInt(num);
if(unit == "W"){
num=Math.round(num*1000)*10; 
}else if(unit == "K"){
num=Math.round(num*100)*10;
}
    }

    return num;
}