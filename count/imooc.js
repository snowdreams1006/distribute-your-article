// 作者基本信息
var nickname = $("#main > div.bg-author.user-head-info > div > div.user-info-right > h3 > span").text();
var learnTime = $("#main > div.bg-author.user-head-info > div > div.study-info.clearfix > div:nth-child(1) > div > em").text();
var learnExperience = $("#main > div.bg-author.user-head-info > div > div.study-info.clearfix > div:nth-child(2) > em").text();
var learnIntegral = $("#main > div.bg-author.user-head-info > div > div.study-info.clearfix > div:nth-child(3) > em").text();
var learnFollows = $("#main > div.bg-author.user-head-info > div > div.study-info.clearfix > div:nth-child(4) > a > em").text();
var learnFans = $("#main > div.bg-author.user-head-info > div > div.study-info.clearfix > div:nth-child(5) > a > em").text();
var articleCount = $("#articleMain > ul > div > div > div > div > a:nth-child(1)").text().replace(/[^0-9]/ig, "");
console.log("昵称: " + nickname + " 学习时长: " + learnTime + " 经验: " + learnExperience + " 积分: " + learnIntegral + " 关注: " + learnFollows + " 粉丝: " + learnFans + " 全部文章: " + articleCount);

// 阅读量
var readCount = 0;
$.each($("#articlesList div:nth-child(1) > em").text().trim().split(" "), function(idx, ele) {
    readCount += parseInt(ele.substr(0, ele.lastIndexOf("浏览")));
});
// 推荐量
var recommendCount = 0;
$.each($("#articlesList div:nth-child(2) > em").text().trim().split(" "), function(idx, ele) {
    recommendCount += parseInt(ele.substr(0, ele.lastIndexOf("推荐")));
});
// 评论量
var commendCount = 0;
$.each($("#articlesList div:nth-child(3) > em").text().trim().split(" "), function(idx, ele) {
    commendCount += parseInt(ele.substr(0, ele.lastIndexOf("评论")));
});
console.log("阅读量: " + readCount + " 推荐量: " + recommendCount + " 评论量: " + commendCount);