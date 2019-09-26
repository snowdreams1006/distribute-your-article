//评论数
var commendCount = 0;
$("#post_list td:nth-child(3)").each(function(idx, ele) {
    commendCount += parseInt($(ele).text().trim());
});
//阅读数
var readCount = 0;
$("#post_list td:nth-child(4)").each(function(idx, ele) {
    readCount += parseInt($(ele).text().trim());
});
console.log("评论数:" + commendCount + ",阅读数:" + readCount);

// https://www.cnblogs.com/snowdreams1006/
var nickname = $("#profile_block > a:nth-child(1)").text().trim();
var gardenAge = $("#profile_block > a:nth-child(3)").text().trim();
var follower = $("#profile_block > a:nth-child(5)").text().trim();
var followee = $("#profile_block > a:nth-child(7)").text().trim();
var originalArticle = $("#mystats").text().replace(/\D*(\d+)\D*(\d+)\D*(\d+)\D*/, '$1');
var comment = $("#mystats").text().replace(/\D*(\d+)\D*(\d+)\D*(\d+)\D*/, '$2');
var referenceArticle = $("#mystats").text().replace(/\D*(\d+)\D*(\d+)\D*(\d+)\D*/, '$3');
console.log("昵称:" + nickname + ",园龄:" + gardenAge + ",粉丝:" + follower + ",关注:" + followee + ",随笔:" + originalArticle + ",评论:" + comment + ",文章:" + referenceArticle);

// 阅读数
var readCount = 0;
// 评论数
var commendCount = 0;
$("#centercontent div.postDesc").each(function(idx, ele) {
    readCount += parseInt($(ele).text().replace(/.*\s*\((\d+)\).*\((\d+)\)\D*/, '$1').trim());
    commendCount += parseInt($(ele).text().replace(/.*\s*\((\d+)\).*\((\d+)\)\D*/, '$2').trim());
});
console.log("阅读数:" + readCount + ",评论数:" + commendCount);

// 分页汇总数据
var countStatics = `阅读数:1441,评论数:0
阅读数:1519,评论数:0
阅读数:1489,评论数:4
阅读数:3441,评论数:0
阅读数:1893,评论数:2
阅读数:2625,评论数:10
阅读数:1421,评论数:4
阅读数:568,评论数:0`;

// 阅读,评论
var readCountStatics = 0;
var commendCountStatics = 0;
$.each($(countStatics.split("\n")), function(idx, val) {
    $.each($(val.split(",")), function(sIdx, sVal) {
        if (sIdx == 0) {
            readCountStatics += parseInt(sVal.replace(/[^0-9]/ig, ""));
        }else {
            commendCountStatics += parseInt(sVal.replace(/[^0-9]/ig, ""));
        }
    });
});
console.log("阅读数:" + readCountStatics + ",评论数:" + commendCountStatics);

