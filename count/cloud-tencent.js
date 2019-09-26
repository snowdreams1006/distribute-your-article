// 阅读量
var readCount = 0;
$("#react-root .com-i-view").each(function(idx, ele) {
    readCount += parseInt($(ele).next().text().trim());
});
// 点赞量
var recommendCount = 0;
$("#react-root .com-i-like").each(function(idx, ele) {
    recommendCount += parseInt($(ele).next().text().trim());
});
console.log("阅读量:" + readCount + ",点赞量:" + recommendCount);

// https://cloud.tencent.com/developer/user/2952369
var nickname = $("#react-root > div:nth-child(1) > div.J-body.com-body.with-bg > div > div > div.intro-main > h3 > span").text();
var following = $("#react-root > div:nth-child(1) > div.J-body.com-body.with-bg > div > div > div.intro-main > ul.intro-datas > li:nth-child(1) > a > span.intro-data-num").text();
var follower = $("#react-root > div:nth-child(1) > div.J-body.com-body.with-bg > div > div > div.intro-main > ul.intro-datas > li:nth-child(2) > a > span.intro-data-num").text();
var articleCount = $("#react-root > div:nth-child(1) > div.J-body.com-body.with-bg > section > div > section > div > div > section:nth-child(78) > section > div > p > span:nth-child(1)").text().replace(/\D+/,"");
var subscriber = $("#react-root > div:nth-child(1) > div.J-body.com-body.with-bg > section > div > section > div > div > section:nth-child(78) > section > div > p > span:nth-child(3)").text().replace(/\D+/,"");
console.log("昵称:" + nickname + ",关注:" + following + ",粉丝:" + follower + ",文章:" + articleCount + ",订阅:" + subscriber);