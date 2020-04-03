# csdn

## 上传图片 [/upload/img](https://blog-console-api.csdn.net/v1/upload/img?shuiyin=2)

### 真实请求

**发起请求**

```bash
curl 'https://blog-console-api.csdn.net/v1/upload/img?shuiyin=2' -H 'authority: blog-console-api.csdn.net' -H 'pragma: no-cache' -H 'cache-control: no-cache' -H 'sec-fetch-dest: empty' -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36' -H 'content-type: multipart/form-data; boundary=----WebKitFormBoundaryxh04FYklVqtV7CFY' -H 'accept: */*' -H 'origin: https://editor.csdn.net' -H 'sec-fetch-site: same-site' -H 'sec-fetch-mode: cors' -H 'referer: https://editor.csdn.net/md/' -H 'accept-language: zh-CN,zh;q=0.9,en;q=0.8' -H $'cookie: 登录凭证' --data-binary $'------WebKitFormBoundaryxh04FYklVqtV7CFY\r\nContent-Disposition: form-data; name="file"; filename="0.jpg"\r\nContent-Type: image/jpeg\r\n\r\n\r\n------WebKitFormBoundaryxh04FYklVqtV7CFY--\r\n' --compressed
```

**响应数据**

```json
{
    "code": 200,
    "msg": "success",
    "data": {
        "url": "https://img-blog.csdnimg.cn/20200403155718154.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zODE3MTE4MA==,size_16,color_FFFFFF,t_70"
    }
}
```

**生成示例**

```markdown
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200403155718154.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zODE3MTE4MA==,size_16,color_FFFFFF,t_70)
```

### 模拟请求

**发起请求**

```bash
curl -i -X POST \
   -H 'Content-Type:multipart/form-data' \
   -H 'Referer: https://editor.csdn.net/md/' \
   -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36' \
   -H 'Cookie: 登录凭证' \
   -F 'file=@"/Users/snowdreams1006/Documents/figure-bed/docs/images/0.jpg";type=image/jpeg;filename="0.jpg"' \
 'https://blog-console-api.csdn.net/v1/upload/img?shuiyin=2'
```

**响应数据**

```json
{
    "code": 200,
    "msg": "success",
    "data": {
        "url": "https://img-blog.csdnimg.cn/20200403160148601.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zODE3MTE4MA==,size_16,color_FFFFFF,t_70"
    }
}
```
