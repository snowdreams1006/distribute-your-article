//阅读量
var readCount = 0;
$("#list-container .ic-list-read").each(function(idx,ele){
    readCount += parseInt($(ele).parent().text().trim());
});
console.log("阅读量: " + readCount);

//评论量
var commendCount = 0;
$("#list-container .ic-list-comments").each(function(idx,ele){
    commendCount += parseInt($(ele).parent().text().trim());
});
console.log("评论量: " + commendCount);

//喜欢量
var recommendCount = 0;
$("#list-container .ic-list-like").each(function(idx,ele){
    recommendCount += parseInt($(ele).parent().text().trim());
});
console.log("喜欢量: " + recommendCount);