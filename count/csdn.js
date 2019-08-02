//阅读量
var readCount = 0;
$.each($("#mainBox .article-list .article-item-box .info-box p:nth-child(3) > span > span"),function(idx,ele){
     readCount += parseInt($(ele).text().trim());
});
console.log("阅读量: " + readCount);

//评论量
var commendCount = 0;
$.each($("#mainBox .article-list .article-item-box .info-box p:nth-child(5) > span > span"),function(idx,ele){
     commendCount += parseInt($(ele).text().trim());
});
console.log("评论量: " + commendCount);