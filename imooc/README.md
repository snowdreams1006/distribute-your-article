# 慕课手记

## 上传图片 [/article/ajaxuploadimg](https://www.imooc.com/article/ajaxuploadimg)

### 真实请求

**发起请求**

```bash
curl 'https://www.imooc.com/article/ajaxuploadimg' -H 'Connection: keep-alive' -H 'Pragma: no-cache' -H 'Cache-Control: no-cache' -H 'Sec-Fetch-Dest: empty' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36' -H 'Content-Type: multipart/form-data; boundary=----WebKitFormBoundary4pPsPZhJjaycVHmA' -H 'Accept: */*' -H 'Origin: https://www.imooc.com' -H 'Sec-Fetch-Site: same-origin' -H 'Sec-Fetch-Mode: cors' -H 'Referer: https://www.imooc.com/article/publish' -H 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8' -H 'Cookie: 登录凭证' --data-binary $'------WebKitFormBoundary4pPsPZhJjaycVHmA\r\nContent-Disposition: form-data; name="id"\r\n\r\nWU_FILE_0\r\n------WebKitFormBoundary4pPsPZhJjaycVHmA\r\nContent-Disposition: form-data; name="name"\r\n\r\ndemo-verify-data-result.png\r\n------WebKitFormBoundary4pPsPZhJjaycVHmA\r\nContent-Disposition: form-data; name="type"\r\n\r\nimage/png\r\n------WebKitFormBoundary4pPsPZhJjaycVHmA\r\nContent-Disposition: form-data; name="lastModifiedDate"\r\n\r\nThu Mar 26 2020 10:54:31 GMT+0800 (中国标准时间)\r\n------WebKitFormBoundary4pPsPZhJjaycVHmA\r\nContent-Disposition: form-data; name="size"\r\n\r\n76736\r\n------WebKitFormBoundary4pPsPZhJjaycVHmA\r\nContent-Disposition: form-data; name="photo"; filename="demo-verify-data-result.png"\r\nContent-Type: image/png\r\n\r\n\r\n------WebKitFormBoundary4pPsPZhJjaycVHmA--\r\n' --compressed
```

**响应数据**

```json
{
    "result": 0,
    "data": {
        "key": "5e86106e0001aa9d17140294",
        "imgpath": "//img.mukewang.com/5e86106e0001aa9d17140294.png",
        "thumbnail": "//img.mukewang.com/5e86106e0001aa9d17140294-80-80.png"
    },
    "msg": "成功"
}
```

**生成示例**

```markdown
![图片描述](//img.mukewang.com/5e86106e0001aa9d17140294.png)
```

### 模拟请求

**发起请求**

```bash
curl -i -X POST \
   -H 'Content-Type:multipart/form-data' \
   -H 'Referer: https://www.imooc.com/article/publish' \
   -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36' \
   -H 'Cookie: 登录凭证' \
   -F 'photo=@"/Users/snowdreams1006/Documents/figure-bed/docs/images/0.jpg";type=image/jpeg;filename="0.jpg"' \
 'https://www.imooc.com/article/ajaxuploadimg'
```

**响应数据**

```json
{
    "result": 0,
    "msg": "上传成功",
    "hashkey": "5e8585f509944fb800840121",
    "pic_url": "//img.mukewang.com/wiki/5e8585f509944fb800840121.jpg"
}
```
