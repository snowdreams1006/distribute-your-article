# 博客园

## 上传图片 [/imageuploader/processupload](https://upload.cnblogs.com/imageuploader/processupload?host=www.cnblogs.com&qqfile=0.jpg)

**生成示例**

```markdown
![](https://img2020.cnblogs.com/blog/1624839/202004/1624839-20200403161311835-480885602.png)
```

### 模拟请求

**发起请求**

```bash
curl -i -X POST \
   -H 'Content-Type:multipart/form-data' \
   -H 'Referer: https://upload.cnblogs.com/imageuploader/upload?host=www.cnblogs.com&editor=4' \
   -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36' \
   -H 'Cookie: 登录凭证' \
   -F 'file=@"/Users/snowdreams1006/Documents/figure-bed/docs/images/0.jpg";type=image/jpeg;filename="0.jpg"' \
 'https://upload.cnblogs.com/imageuploader/processupload'
```


**响应数据**

```json
{
    "success": true,
    "message": "https://img2020.cnblogs.com/other/1624839/202004/1624839-20200403162530303-1569141120.jpg"
}
```
