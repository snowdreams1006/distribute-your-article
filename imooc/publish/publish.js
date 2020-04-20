// https://www.imooc.com/u/index/articles
var request = require('request');
var fs = require('fs');

// 配置
var globalConfig = {
    // 网站登录凭证,必选. 获取方法: 打开浏览器控制台,运行 copy(document.cookie) 再粘贴到此处.
    'Cookie': fs.writeFileSync('./cookie.txt','utf8'),
    // 浏览器用户代理,可选.获取方法: 打开浏览器控制台,运行 copy(navigator.userAgent) 再粘贴到此处.
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36'
};

/**
* @description 获取尾页页码
* @example getMaxPage();
* @return 尾页
*/
function getMaxPage(){
    return new Promise((resolve, reject) => {
        var options = {
            url: 'https://www.imooc.com/u/index/articles',
            headers : {
                'User-Agent': globalConfig['User-Agent'],
                'Referer': 'https://www.imooc.com/u/index/articles',
                'Cookie': globalConfig['Cookie']
            }
        };
        request.get(options, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var regex = /<a href="\/u\/index\/articles\?page=(\d+)">尾页<\/a>/;
                var result;
                if ((result = regex.exec(body)) !== null) {
                    var maxPage = result[1];
                    resolve(maxPage);
                }else{
                    reject(body);
                }
            }else{
                reject(error)
            }
        });
    });
}

/**
* @description 测试获取尾页页码
* @example testGetMaxPage();
*/
async function testGetMaxPage() {
    try {
        // 尾页
        var maxPage = await getMaxPage();
        console.log(maxPage);
        console.log();
    } catch(err) {
        console.error(err);
    }
}

/**
* @description 手记列表页面
* @example listPage(3);
* @return 手记详情
*/
function listPage(page=1){
    var qs = {
        'page': page
    };
    return new Promise((resolve, reject) => {
        var options = {
            url: 'https://www.imooc.com/u/index/articles',
            headers : {
                'User-Agent': globalConfig['User-Agent'],
                'Referer': 'https://www.imooc.com/u/index/articles',
                'Cookie': globalConfig['Cookie']
            },
            qs: qs
        };
        request.get(options, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var regex = /<a.*href="(.+)".*class="title-detail".*>(.+)<\/a>/g;
                var result;
                if(regex.test(body)){
                    var list = [];
                    while ((result = regex.exec(body)) !== null) {
                        if (result.index === regex.lastIndex) {
                            regex.lastIndex++;
                        }

                        var article = {};

                        var href = result[1];
                        var title = result[2];

                        article['href'] = href;
                        article['title'] = title;

                        list.push(article);
                    }
                    resolve(list);
                }else{
                    reject(body);
                }
            }else{
                reject(error)
            }
        });
    });
}

/**
* @description 测试手记列表页面
* @example testListPage();
*/
async function testListPage() {
    try {
        // 首页列表
        var list = await listPage();
        console.log(list);
        console.log();
    } catch(err) {
        console.error(err);
    }
}

/**
* @description 获取手记详情页面
* @example getDetailPage('/article/303091');
* @return 手记详情
*/
function getDetailPage(href){
    return new Promise((resolve, reject) => {
        var options = {
            url: `https://www.imooc.com${href}`,
            headers : {
                'User-Agent': globalConfig['User-Agent'],
                'Referer': 'https://www.imooc.com/u/index/articles',
                'Cookie': globalConfig['Cookie']
            }
        };
        request.get(options, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var regex = /<span class="spacer">(.+?)<\/span>/g;
                var result;
                if ((result = regex.exec(body)) !== null) {
                    var datetime = result[1];

                    resolve(datetime);
                }else{
                    reject(body);
                }
            }else{
                reject(error)
            }
        });
    });
}

/**
* @description 测试获取手记详情页面
* @example testGetDetailPage();
*/
async function testGetDetailPage() {
    try {
        // 手记详情
        var href = '/article/303091';
        var datetime = await getDetailPage(href);
        console.log(datetime);
        console.log();
    } catch(err) {
        console.error(err);
    }
}

/**
* @description 列出全部页面
* @example listAllPage();
* @param page 起始页
* @return 全部手记列表
*/
function listAllPage(page = 1){
    var maxPage = await getMaxPage();

    return new Promise(async (resolve, reject) => {
        try {
            var list = await listPage(page);
            if (list && list.length > 0) {
                if(page <= maxPage){
                    var nextList = await listAllPage(++page);
                    list = list.concat(nextList);
                }
            }
            resolve(list);
        } catch (error) {
            reject(error);
        }
    });
}

/**
* @description 测试列出全部页面
* @example testListAllPage();
*/
async function testListAllPage() {
    try {
        var list = await listAllPage();
        console.log(list);
        console.log();
    } catch(err) {
        console.error(err);
    }
}

/**
* @description 写入全部页面
* @example writeAllPage();
*/
async function writeAllPage() {
    try {
        // 全部页面
        var result = [];
        var list = await listAllPage();
        for (var i = 0; i < list.length; i++) {
            var articleInfo = list[i];

            var href = articleInfo.href;
            var datetime = await getDetailPage(href);
            articleInfo.datetime = datetime;

            result.push(articleInfo);
        }

        // 保存返回值
        fs.writeFileSync(`all-articles.json`,JSON.stringify(result));
    } catch(err) {
        console.error(err);
    }
}


