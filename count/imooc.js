// 阅读
var readCount = 0;
$.each($("#articlesList div:nth-child(1) > em").text().trim().split(" "), function(idx, ele) {
    readCount += parseInt(ele.substr(0, ele.lastIndexOf("浏览")));
});
// 推荐
var recommendCount = 0;
$.each($("#articlesList div:nth-child(2) > em").text().trim().split(" "), function(idx, ele) {
    recommendCount += parseInt(ele.substr(0, ele.lastIndexOf("推荐")));
});
// 评论
var commendCount = 0;
$.each($("#articlesList div:nth-child(3) > em").text().trim().split(" "), function(idx, ele) {
    commendCount += parseInt(ele.substr(0, ele.lastIndexOf("评论")));
});
console.log("阅读:" + readCount + ",推荐:" + recommendCount + ",评论:" + commendCount);

// https://www.imooc.com/u/5224488/articles
var nickname = $("#main > div.bg-author.user-head-info > div > div.user-info-right > h3 > span").text();
var learnTime = $("#main > div.bg-author.user-head-info > div > div.study-info.clearfix > div:nth-child(1) > div > em").text();
var learnExperience = $("#main > div.bg-author.user-head-info > div > div.study-info.clearfix > div:nth-child(2) > em").text();
var learnIntegral = $("#main > div.bg-author.user-head-info > div > div.study-info.clearfix > div:nth-child(3) > em").text();
var follows = $("#main > div.bg-author.user-head-info > div > div.study-info.clearfix > div:nth-child(4) > a > em").text();
var fans = $("#main > div.bg-author.user-head-info > div > div.study-info.clearfix > div:nth-child(5) > a > em").text();
var articleCount = $("#articleMain > ul > div > div > div > div > a:nth-child(1)").text().replace(/[^0-9]/ig, "");
console.log("昵称:" + nickname + ",学习时长:" + learnTime + ",经验:" + learnExperience + ",积分:" + learnIntegral + ",关注:" + follows + ",粉丝:" + fans + ",全部文章:" + articleCount);

// 分页汇总数据
var countStatics = `阅读:6167,推荐:25,评论:1
阅读:11949,推荐:34,评论:1
阅读:8274,推荐:24,评论:1
阅读:3480,推荐:16,评论:1`;

// 阅读,推荐,评论
var readCountStatics = 0;
var recommendCountStatics = 0;
var commendCountStatics = 0;
$.each($(countStatics.split("\n")), function(idx, val) {
    $.each($(val.split(",")), function(sIdx, sVal) {
        if (sIdx == 0) {
            readCountStatics += parseInt(sVal.replace(/[^0-9]/ig, ""));
        } else if (sIdx == 1) {
            recommendCountStatics += parseInt(sVal.replace(/[^0-9]/ig, ""));
        } else {
            commendCountStatics += parseInt(sVal.replace(/[^0-9]/ig, ""));
        }
    });
});
console.log("阅读:" + readCountStatics + ",推荐:" + recommendCountStatics + ",评论:" + commendCountStatics);

