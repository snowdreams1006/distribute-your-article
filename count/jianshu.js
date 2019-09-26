// 阅读量
var drillCount = 0;
$("#list-container .ic-paid1").each(function(idx, ele) {
    drillCount += parseFloat($(ele).parent().text().trim());
});
// 阅读量
var readCount = 0;
$("#list-container .ic-list-read").each(function(idx, ele) {
    readCount += parseInt($(ele).parent().text().trim());
});
// 评论量
var commendCount = 0;
$("#list-container .ic-list-comments").each(function(idx, ele) {
    commendCount += parseInt($(ele).parent().text().trim());
});
// 喜欢量
var recommendCount = 0;
$("#list-container .ic-list-like").each(function(idx, ele) {
    recommendCount += parseInt($(ele).parent().text().trim());
});
console.log("简书钻:" + drillCount + ",阅读量:" + readCount + ",评论量:" + commendCount + ",喜欢量:" + recommendCount);

// https://www.jianshu.com/u/577b0d76ab87
var nickname = $("body > div.container.person > div > div.col-xs-16.main > div.main-top > div.title > a").text();
var following = $("body > div.container.person > div > div.col-xs-16.main > div.main-top > div.info > ul > li:nth-child(1) > div > a > p").text();
var follower = $("body > div.container.person > div > div.col-xs-16.main > div.main-top > div.info > ul > li:nth-child(2) > div > a > p").text();
var articleCount = $("body > div.container.person > div > div.col-xs-16.main > div.main-top > div.info > ul > li:nth-child(3) > div > a > p").text();
var articleWord = $("body > div.container.person > div > div.col-xs-16.main > div.main-top > div.info > ul > li:nth-child(4) > div > p").text();
var harvestLike = $("body > div.container.person > div > div.col-xs-16.main > div.main-top > div.info > ul > li:nth-child(5) > div > p").text();
var totalAsset = $("body > div.container.person > div > div.col-xs-16.main > div.main-top > div.info > ul > li:nth-child(6) > div > p").text();
console.log("昵称:" + nickname + ",关注:" + following + ",粉丝:" + follower + ",文章:" + articleCount + ",字数:" + articleWord + ",收获字数:" + harvestLike + ",总资产:" + totalAsset);