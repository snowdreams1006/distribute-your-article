//点赞量
var recommendCount = 0;
var recommendElements = document.querySelectorAll("#juejin .entry-list .item .action-row .action-list .like");
for (var i = 0; i < recommendElements.length; i++) {
    var recommend = recommendElements[i].querySelector("span.likedCount") && recommendElements[i].querySelector("span.likedCount").innerText.trim();
    recommendCount += parseInt(recommend) || 0;
}
console.log("点赞量: " + recommendCount);

//评论量
var commendCount = 0;
var commendElements = document.querySelectorAll("#juejin .entry-list .item .action-row .action-list .comment");
for (var i = 0; i < commendElements.length; i++) {
    var commend = commendElements[i].querySelector("span.count") && commendElements[i].querySelector("span.count").innerText.trim();
    commendCount += parseInt(commend) || 0;
}
console.log("评论量: " + commendCount);

//阅读量
var readCount = 0;
var readElements = document.querySelectorAll("#juejin .entry-list .item .action-row .entry-action-box .view-count");
for (var i = 0; i < readElements.length; i++) {
    var read = readElements[i].innerText.substr(2).trim();
    readCount += parseInt(read) || 0;
}
console.log("阅读量: " + readCount);

