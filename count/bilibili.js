// https://space.bilibili.com/236627025
var nickname = $("#h-name").text();
var following = $("#n-gz").text();
var follower = $("#n-fs").text();
var playCount = $("#navigator > div > div.n-inner.clearfix > div.n-statistics > div:nth-child(3) > .n-data-v").text();
var readCount = $("#navigator > div > div.n-inner.clearfix > div.n-statistics > div:nth-child(4) > .n-data-v").text();
console.log("昵称:" + nickname + ",关注数:" + following + ",粉丝数:" + follower + ",播放数:" + playCount + ",阅读数:" + readCount);