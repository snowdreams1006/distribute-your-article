# 今日头条

## 上传图片 [/mp/agw/article_material/photo/upload_picture](https://mp.toutiao.com/mp/agw/article_material/photo/upload_picture?type=ueditor&pgc_watermark=1&action=uploadimage&encode=utf-8)

### 真实请求

**发起请求**

```bash
curl 'https://mp.toutiao.com/mp/agw/article_material/photo/upload_picture?type=ueditor&pgc_watermark=1&action=uploadimage&encode=utf-8' -H 'Connection: keep-alive' -H 'Pragma: no-cache' -H 'Cache-Control: no-cache' -H 'Sec-Fetch-Dest: empty' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36' -H 'Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryB1XzAOdrMbELOI4s' -H 'Accept: */*' -H 'Origin: https://mp.toutiao.com' -H 'Sec-Fetch-Site: same-origin' -H 'Sec-Fetch-Mode: cors' -H 'Referer: https://mp.toutiao.com/profile_v3/graphic/publish' -H 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8' -H 'Cookie: 登录凭证' --data-binary $'------WebKitFormBoundaryB1XzAOdrMbELOI4s\r\nContent-Disposition: form-data; name="upfile"; filename="snowdreams1006-wechat-open.png"\r\nContent-Type: image/png\r\n\r\n\r\n------WebKitFormBoundaryB1XzAOdrMbELOI4s--\r\n' --compressed
```

**响应数据**

```json
{
    "code": 0,
    "height": 800,
    "image_type": 1,
    "message": "success",
    "mime_type": "image/jpeg",
    "origin_web_uri": "pgc-image/db3eac62a8594a0a97b6eedd11b95e80",
    "original": "pgc-image/db3eac62a8594a0a97b6eedd11b95e80",
    "state": "SUCCESS",
    "title": "",
    "url": "https://p9-tt.byteimg.com/large/pgc-image/db3eac62a8594a0a97b6eedd11b95e80",
    "web_uri": "pgc-image/db3eac62a8594a0a97b6eedd11b95e80",
    "web_url": "https://p9-tt.byteimg.com/large/pgc-image/db3eac62a8594a0a97b6eedd11b95e80",
    "width": 2800,
    "wm_uri_media": ""
}
```

**生成示例**

```markdown
![图片描述](//img.mukewang.com/5e86106e0001aa9d17140294.png)
```

```html
<img class="" src="http://p1.pstatp.com/origin/pgc-image/db3eac62a8594a0a97b6eedd11b95e80" ic="false" image_type="1" mime_type="image/png" web_uri="pgc-image/db3eac62a8594a0a97b6eedd11b95e80" img_width="2800" img_height="800">
```

### 模拟请求

**发起请求**

```bash
curl -i -X POST \
   -H 'Content-Type:multipart/form-data' \
   -H 'Origin: https://mp.toutiao.com' \
   -H 'Referer: https://mp.toutiao.com/profile_v3/graphic/publish' \
   -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36' \
   -H 'Cookie: 登录凭证' \
   -F 'upfile=@"/Users/snowdreams1006/Documents/figure-bed/docs/images/0.jpg";type=image/jpeg;filename="0.jpg"' \
 'https://mp.toutiao.com/mp/agw/article_material/photo/upload_picture?type=ueditor&pgc_watermark=1&action=uploadimage&encode=utf-8'
```

**响应数据**

```json
{
    "code": 0,
    "height": 458,
    "image_type": 1,
    "message": "success",
    "mime_type": "image/jpeg",
    "origin_web_uri": "pgc-image/6d6b99154e1a49998115eef8c5749c13",
    "original": "pgc-image/6d6b99154e1a49998115eef8c5749c13",
    "state": "SUCCESS",
    "title": "",
    "url": "https://p6-tt.byteimg.com/large/pgc-image/6d6b99154e1a49998115eef8c5749c13",
    "web_uri": "pgc-image/6d6b99154e1a49998115eef8c5749c13",
    "web_url": "https://p6-tt.byteimg.com/large/pgc-image/6d6b99154e1a49998115eef8c5749c13",
    "width": 500,
    "wm_uri_media": ""
}
```
