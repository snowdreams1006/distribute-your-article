// 阅读数
var readCount = 0;
$.each($("#mainBox .article-list .article-item-box .info-box p:nth-child(3) > span > span"), function(idx, ele) {
    readCount += parseInt($(ele).text().trim());
});
// 评论数
var commendCount = 0;
$.each($("#mainBox .article-list .article-item-box .info-box p:nth-child(5) > span > span"), function(idx, ele) {
    commendCount += parseInt($(ele).text().trim());
});
console.log("阅读数:" + readCount + ",评论数:" + commendCount);

// https://blog.csdn.net/weixin_38171180
var nickname = $("#uid").text();
var originalArticle = $("#asideProfile > div.data-info.d-flex.item-tiling > dl:nth-child(1) > dd > a > span").text();
var fans = $("#fan").text();
var like = $("#asideProfile > div.data-info.d-flex.item-tiling > dl:nth-child(3) > dd > span").text();
var comment = $("#asideProfile > div.data-info.d-flex.item-tiling > dl:nth-child(4) > dd > span").text();
var level = $("#asideProfile > div.grade-box.clearfix > dl:nth-child(1) > dd > a").attr("title").replace(/[^0-9]/ig, "");
var access = $("#asideProfile > div.grade-box.clearfix > dl:nth-child(2) > dd").text().trim();;
var integral = $("#asideProfile > div.grade-box.clearfix > dl:nth-child(3) > dd").text().trim();;
var rank = $("#asideProfile > div.grade-box.clearfix > dl:nth-child(4)").attr("title");
var medal = "";
$.each($("#asideProfile > div.badge-box.d-flex .icon-badge"), function(idx, ele) {
    medal += $(ele).attr("title") + ","
});
medal = medal.substr(0, medal.length - 1);

console.log("昵称:" + nickname + ",原创:" + originalArticle + ",粉丝:" + fans + ",喜欢:" + like + ",评论:" + comment + ",等级:" + level + ",访问:" + access + ",积分:" + integral + ",排名:" + rank + ",勋章:" + medal);

// 分页汇总数据
var countStatics = `阅读数:289,评论数:2
阅读数:1387,评论数:0
阅读数:1140,评论数:0
阅读数:1001,评论数:0`;

// 阅读,推荐,评论
var readCountStatics = 0;
var commendCountStatics = 0;
$.each($(countStatics.split("\n")), function(idx, val) {
    $.each($(val.split(",")), function(sIdx, sVal) {
        if (sIdx == 0) {
            readCountStatics += parseInt(sVal.replace(/[^0-9]/ig, ""));
        } else {
            commendCountStatics += parseInt(sVal.replace(/[^0-9]/ig, ""));
        }
    });
});
console.log("阅读数:" + readCountStatics + ",评论数:" + commendCountStatics);