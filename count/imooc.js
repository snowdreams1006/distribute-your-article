//阅读量
var readCount = 0;
$.each($("#articlesList div:nth-child(1) > em").text().trim().split(" "),function(idx,ele){
     readCount += parseInt(ele.substr(0,ele.lastIndexOf("浏览")));
});
console.log("阅读量: " + readCount);

//推荐量
var recommendCount = 0;
$.each($("#articlesList div:nth-child(2) > em").text().trim().split(" "),function(idx,ele){
     recommendCount += parseInt(ele.substr(0,ele.lastIndexOf("推荐")));
});
console.log("推荐量: " + recommendCount);

//评论量
var commendCount = 0;
$.each($("#articlesList div:nth-child(3) > em").text().trim().split(" "),function(idx,ele){
     commendCount += parseInt(ele.substr(0,ele.lastIndexOf("评论")));
});
console.log("评论量: " + commendCount);