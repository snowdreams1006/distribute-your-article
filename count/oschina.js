//阅读量
var readCount = 0;
$.each($("#newestBlogList .items .item .content .extra .eye"),function(idx,ele){    
    readCount += parseInt(numReconvert($(ele).parent().text().trim()));
});
console.log("阅读量: " + readCount);

//评论量
var commendCount = 0;
$.each($("#newestBlogList .items .item .content .extra .comment"),function(idx,ele){
    commendCount += parseInt(numReconvert($(ele).parent().text().trim()));
});
console.log("评论量: " + commendCount);

function numConvert(num){
    if(num>=10000){
      num=Math.round(num/1000)/10+'W';
    }else if(num>=1000){
      num=Math.round(num/100)/10+'K';
    }
    return num;
}

function numReconvert(numStr){
	var unit = numStr.substr(-1);
	var num = numStr;
	if(unit == "W" || unit == "K"){
	num = numStr.substr(0,numStr.indexOf(unit));
	num= parseInt(num);
if(unit == "W"){
num=Math.round(num*1000)*10; 
}else if(unit == "K"){
num=Math.round(num*100)*10;
}
	}

    return num;
}
