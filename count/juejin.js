//点赞量
var recommendCount = 0;
var recommendElements = document.querySelectorAll("#juejin .entry-list .item .action-row .action-list .like");
for (var i = 0; i < recommendElements.length; i++) {
    var recommend = recommendElements[i].querySelector("span.likedCount") && recommendElements[i].querySelector("span.likedCount").innerText.trim();
    recommendCount += parseInt(recommend) || 0;
}
//评论量
var commendCount = 0;
var commendElements = document.querySelectorAll("#juejin .entry-list .item .action-row .action-list .comment");
for (var i = 0; i < commendElements.length; i++) {
    var commend = commendElements[i].querySelector("span.count") && commendElements[i].querySelector("span.count").innerText.trim();
    commendCount += parseInt(commend) || 0;
}
//阅读量
var readCount = 0;
var readElements = document.querySelectorAll("#juejin .entry-list .item .action-row .entry-action-box .view-count");
for (var i = 0; i < readElements.length; i++) {
    var read = readElements[i].innerText.substr(2).trim();
    readCount += parseInt(read) || 0;
}
console.log("点赞量:" + recommendCount + ",评论量:" + commendCount + ",阅读量:" + readCount);

// https://juejin.im/user/582d5cb667f356006331e586
var nickname = document.querySelector("#juejin > div.view-container > main > div.view.user-view > div.major-area > div.user-info-block.block.shadow > div.info-box.info-box > div.top > h1").innerText;
var praise = document.querySelector("#juejin > div.view-container > main > div.view.user-view > div.minor-area > div > div.stat-block.block.shadow > div.block-body > div:nth-child(1) > span > span").innerText;
var readCount = document.querySelector("#juejin > div.view-container > main > div.view.user-view > div.minor-area > div > div.stat-block.block.shadow > div.block-body > div:nth-child(2) > span > span").innerText.replace(/,+/, "");
var jp = document.querySelector("#juejin > div.view-container > main > div.view.user-view > div.minor-area > div > div.stat-block.block.shadow > div.block-body > div:nth-child(3) > span > span").innerText;
var following = document.querySelector("#juejin > div.view-container > main > div.view.user-view > div.minor-area > div > div.follow-block.block.shadow > a:nth-child(1) > div.item-count").innerText;
var follower = document.querySelector("#juejin > div.view-container > main > div.view.user-view > div.minor-area > div > div.follow-block.block.shadow > a:nth-child(2) > div.item-count").innerText;
var post = document.querySelector("#juejin > div.view-container > main > div.view.user-view > div.major-area > div.list-block > div > div.list-header > div > a:nth-child(3) > div.item-count").innerText;
var pin = document.querySelector("#juejin > div.view-container > main > div.view.user-view > div.major-area > div.list-block > div > div.list-header > div > a:nth-child(4) > div.item-count").innerText;
var share = document.querySelector("#juejin > div.view-container > main > div.view.user-view > div.major-area > div.list-block > div > div.list-header > div > a:nth-child(5) > div.item-count").innerText;
var like = document.querySelector("#juejin > div.view-container > main > div.view.user-view > div.major-area > div.list-block > div > div.list-header > div > div:nth-child(6) > div:nth-child(2)").innerText;
var book = document.querySelector("#juejin > div.view-container > main > div.view.user-view > div.major-area > div.list-block > div > div.list-header > div > a:nth-child(8) > div.item-count").innerText;
console.log("昵称:" + nickname + ",获得点赞:" + praise + ",文章被阅读:" + readCount + ",掘力值:" + jp + ",关注了:" + following + ",关注者:" + follower + ",专栏:" + post + ",沸点:" + pin + ",分享:" + share + ",赞:" + like + ",小册:" + book);