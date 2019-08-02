//阅读量
var readCount = 0;
$("#react-root .com-i-view").each(function(idx,ele){
    readCount += parseInt($(ele).next().text().trim());
});
console.log("阅读量: " + readCount);

//点赞量
var recommendCount = 0;
$("#react-root .com-i-like").each(function(idx,ele){
    recommendCount += parseInt($(ele).next().text().trim());
});
console.log("点赞量: " + recommendCount);