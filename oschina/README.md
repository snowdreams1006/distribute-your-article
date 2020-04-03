# 开源中国

## 上传图片 [/space/markdown_img_upload](https://my.oschina.net/snowdreams1006/space/markdown_img_upload?guid=1585904378051)

### 真实请求

**发起请求**

```bash
curl 'https://my.oschina.net/snowdreams1006/space/markdown_img_upload?guid=1585904378051' -X POST -H 'Connection: keep-alive' -H 'Content-Length: 3862' -H 'Pragma: no-cache' -H 'Cache-Control: no-cache' -H 'Origin: https://my.oschina.net' -H 'Upgrade-Insecure-Requests: 1' -H 'Content-Type: multipart/form-data; boundary=----WebKitFormBoundarySmK2kIo5AxVGisie' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36' -H 'Sec-Fetch-Dest: iframe' -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9' -H 'Sec-Fetch-Site: same-origin' -H 'Sec-Fetch-Mode: navigate' -H 'Sec-Fetch-User: ?1' -H 'Referer: https://my.oschina.net/snowdreams1006/blog/write' -H 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8' -H 'Cookie: 登录凭证' --compressed
```

**响应数据**

```json
{
    "success": 1,
    "url": "https://oscimg.oschina.net/oscnet/up-597e7682b69e1efa1cc0175472572253ec5.png"
}
```

**生成示例**

```markdown
![](https://oscimg.oschina.net/oscnet/up-597e7682b69e1efa1cc0175472572253ec5.png)
```

### 模拟请求

**发起请求**

```bash
curl -i -X POST \
   -H 'Content-Type:multipart/form-data' \
   -H 'Referer: https://my.oschina.net/snowdreams1006/blog/write' \
   -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36' \
   -H 'Cookie: 登录凭证' \
   -F 'editormd-image-file=@"/Users/snowdreams1006/Documents/figure-bed/docs/images/0.jpg";type=image/jpeg;filename="0.jpg"' \
 'https://my.oschina.net/snowdreams1006/space/markdown_img_upload?guid=1585904378051'
```

**响应数据**

```json
{
    "success": 1,
    "url": "https://oscimg.oschina.net/oscnet/up-bee0b313d181bd8dee297ad926e73dc6a3b.JPEG"
}
```
