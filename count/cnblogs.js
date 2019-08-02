//评论数
var commendCount = 0;
$("#post_list td:nth-child(3)").each(function(idx,ele){
    commendCount += parseInt($(ele).text().trim());
});
console.log("评论数: " + commendCount);

//阅读数
var readCount = 0;
$("#post_list td:nth-child(4)").each(function(idx,ele){
    readCount += parseInt($(ele).text().trim());
});
console.log("阅读数: " + readCount);
