# 简书

## 请求令牌 [/upload_images/token.json](https://www.jianshu.com/upload_images/token.json)

### 真实请求

**发起请求**

```bash
curl 'https://www.jianshu.com/upload_images/token.json?filename=demo-verify-data-regex.png' -H 'Connection: keep-alive' -H 'Pragma: no-cache' -H 'Cache-Control: no-cache' -H 'Accept: application/json' -H 'Sec-Fetch-Dest: empty' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36' -H 'Sec-Fetch-Site: same-origin' -H 'Sec-Fetch-Mode: cors' -H 'Referer: https://www.jianshu.com/writer' -H 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8' -H 'Cookie: 登录凭证' --compressed
```

**响应数据**

```json
{
    "token": "临时令牌",
    "key": "upload_images/16648241-6c547669116499ce.png"
}
```

### 模拟请求

**发起请求**

```bash
curl 'https://www.jianshu.com/upload_images/token.json?filename=0.jpg' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36' -H 'Referer: https://www.jianshu.com/writer' -H 'Cookie: 登录凭证'
```

**响应数据**

```json
{
    "token": "临时令牌",
    "key": "upload_images/16648241-856e29879e19a8af.jpg"
}
```

## 上传图片 [upload.qiniup.com](https://upload.qiniup.com/)

### 真实请求

**发起请求**

```bash
curl 'https://upload.qiniup.com/' -H 'Connection: keep-alive' -H 'Pragma: no-cache' -H 'Cache-Control: no-cache' -H 'Accept: application/json' -H 'Sec-Fetch-Dest: empty' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36' -H 'Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryvYDuBysAftwB0u8t' -H 'Origin: https://www.jianshu.com' -H 'Sec-Fetch-Site: cross-site' -H 'Sec-Fetch-Mode: cors' -H 'Referer: https://www.jianshu.com/writer' -H 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8' --data-binary $'------WebKitFormBoundaryvYDuBysAftwB0u8t\r\nContent-Disposition: form-data; name="token"\r\n\r\n临时令牌\r\n------WebKitFormBoundaryvYDuBysAftwB0u8t\r\nContent-Disposition: form-data; name="key"\r\n\r\nupload_images/16648241-6c547669116499ce.png\r\n------WebKitFormBoundaryvYDuBysAftwB0u8t\r\nContent-Disposition: form-data; name="file"; filename="demo-verify-data-regex.png"\r\nContent-Type: image/png\r\n\r\n\r\n------WebKitFormBoundaryvYDuBysAftwB0u8t\r\nContent-Disposition: form-data; name="x:protocol"\r\n\r\nhttps\r\n------WebKitFormBoundaryvYDuBysAftwB0u8t--\r\n' --compressed
```

**响应数据**

```json
{
    "format": "png",
    "height": 53,
    "url": "https://upload-images.jianshu.io/upload_images/16648241-6c547669116499ce.png",
    "width": 107
}
```

**使用示例**

### 模拟请求

**发起请求**

```bash
curl -i -X POST \
   -H 'Content-Type:multipart/form-data' \
   -H 'Referer: https://www.jianshu.com/writer' \
   -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36' \
   -F 'token="临时令牌"' \
   -F 'key="upload_images/16648241-d450eb2467a88946.png"' \
   -F 'file=@"/Users/snowdreams1006/Documents/figure-bed/docs/images/0.jpg";type=image/jpeg;filename="0.jpg"' \
   -F 'x:protocol=https' \
 'https://upload.qiniup.com/'
```

**响应数据**

```json
{
    "format": "jpeg",
    "height": 458,
    "url": "https://upload-images.jianshu.io/upload_images/16648241-05506906de6a5a15.jpg",
    "width": 500
}
```