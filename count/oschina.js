//阅读量
var readCount = 0;
$.each($("#newestBlogList .items .item .content .extra .eye"), function(idx, ele) {
    readCount += parseInt(numReconvert($(ele).parent().text().trim()));
});
//评论量
var commendCount = 0;
$.each($("#newestBlogList .items .item .content .extra .comment"), function(idx, ele) {
    commendCount += parseInt(numReconvert($(ele).parent().text().trim()));
});
console.log("阅读量:" + readCount + ",评论量:" + commendCount);

function numConvert(num) {
    if (num >= 10000) {
        num = Math.round(num / 1000) / 10 + 'W';
    } else if (num >= 1000) {
        num = Math.round(num / 100) / 10 + 'K';
    }
    return num;
}

function numReconvert(numStr) {
    var unit = numStr.substr(-1);
    var num = numStr;
    if (unit == "W" || unit == "K") {
        num = numStr.substr(0, numStr.indexOf(unit));
        num = parseInt(num);
        if (unit == "W") {
            num = Math.round(num * 1000) * 10;
        } else if (unit == "K") {
            num = Math.round(num * 100) * 10;
        }
    }

    return num;
}

// https://my.oschina.net/snowdreams1006
var nickname = $("#mainScreen > div > div.ui.grid.space-home > div > div.five.wide.computer.five.wide.tablet.sixteen.wide.mobile.column > div > div.ui.basic.center.aligned.segment.sidebar-section.user-info > div.ui.header > h3").text();
var integral = $("#mainScreen > div > div.ui.grid.space-home > div > div.five.wide.computer.five.wide.tablet.sixteen.wide.mobile.column > div > div.ui.basic.center.aligned.segment.sidebar-section.user-info > div.ui.three.tiny.statistics.user-statistics > a:nth-child(1) > div.value").text().trim();
var follower = $("#mainScreen > div > div.ui.grid.space-home > div > div.five.wide.computer.five.wide.tablet.sixteen.wide.mobile.column > div > div.ui.basic.center.aligned.segment.sidebar-section.user-info > div.ui.three.tiny.statistics.user-statistics > a:nth-child(2) > div.value").text().trim();
var following = $("#mainScreen > div > div.ui.grid.space-home > div > div.five.wide.computer.five.wide.tablet.sixteen.wide.mobile.column > div > div.ui.basic.center.aligned.segment.sidebar-section.user-info > div.ui.three.tiny.statistics.user-statistics > a:nth-child(3) > div.value").text().trim();
var accessCount = $("#mainScreen > div > div.ui.grid.space-home > div > div.five.wide.computer.five.wide.tablet.sixteen.wide.mobile.column > div > div:nth-child(4) > div > div:nth-child(5)").text().replace(/\D+/, "");
var articleCount = $("#mainScreen > div > div.ui.grid.space-home > div > div.eleven.wide.computer.eleven.wide.tablet.sixteen.wide.mobile.column > div.space-index-container > div.hidden-scroll.global-mb > div > div.ui.dropdown.item.active.blog-dropdown.on.visible > div.menu.transition.visible > a.item.on.selected > span.description").text();
console.log("昵称:" + nickname + ",积分:" + integral + ",粉丝:" + follower + ",关注:" + following + ",访问量:" + accessCount + ",全部文章:" + articleCount);