# 掘金

## 上传图片 [/upload](https://cdn-ms.juejin.im/v1/upload?bucket=gold-user-assets)

### 真实请求

**发起请求**

```bash
curl 'https://cdn-ms.juejin.im/v1/upload?bucket=gold-user-assets' -H 'Connection: keep-alive' -H 'Pragma: no-cache' -H 'Cache-Control: no-cache' -H 'Sec-Fetch-Dest: empty' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36' -H 'Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryw1RAmHiKjWlFE2vu' -H 'Accept: */*' -H 'Origin: https://juejin.im' -H 'Sec-Fetch-Site: same-site' -H 'Sec-Fetch-Mode: cors' -H 'Referer: https://juejin.im/editor/drafts/new' -H 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8' --data-binary $'------WebKitFormBoundaryw1RAmHiKjWlFE2vu\r\nContent-Disposition: form-data; name="file"; filename="\\r.png"\r\nContent-Type: image/png\r\n\r\n\r\n------WebKitFormBoundaryw1RAmHiKjWlFE2vu--\r\n' --compressed
```

**响应数据**

```json
{
    "s": 1,
    "m": "ok",
    "d": {
        "key": "2020/4/3/1713f26e105ffddf",
        "domain": "user-gold-cdn.xitu.io",
        "url": {
            "http": "http://user-gold-cdn.xitu.io/2020/4/3/1713f26e105ffddf?w=177&h=43&f=png&s=3359",
            "https": "https://user-gold-cdn.xitu.io/2020/4/3/1713f26e105ffddf?w=177&h=43&f=png&s=3359"
        },
        "imageInfo": {
            "width": 177,
            "height": 43,
            "format": "png",
            "size": 3359
        }
    }
}
```

**生成示例**

```markdown
![](https://user-gold-cdn.xitu.io/2020/4/3/1713f26e105ffddf?w=177&h=43&f=png&s=3359)
```

### 模拟请求

**发起请求**

```bash
curl -i -X POST \
   -H 'Content-Type:multipart/form-data' \
   -H 'Referer: https://juejin.im/editor/drafts/new' \
   -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36' \
   -F 'file=@"/Users/snowdreams1006/Documents/figure-bed/docs/images/0.jpg";type=image/jpeg;filename="0.jpg"' \
 'https://cdn-ms.juejin.im/v1/upload?bucket=gold-user-assets'
```

**响应数据**

```json
{
    "s": 1,
    "m": "ok",
    "d": {
        "key": "2020/4/3/1713f2b1ac43eae0",
        "domain": "user-gold-cdn.xitu.io",
        "url": {
            "http": "http://user-gold-cdn.xitu.io/2020/4/3/1713f2b1ac43eae0?w=500&h=458&f=jpeg&s=13233",
            "https": "https://user-gold-cdn.xitu.io/2020/4/3/1713f2b1ac43eae0?w=500&h=458&f=jpeg&s=13233"
        },
        "imageInfo": {
            "width": 500,
            "height": 458,
            "format": "jpeg",
            "size": 13233
        }
    }
}
```
