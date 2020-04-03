# 思否

## 上传图片 [/img/upload/image](https://segmentfault.com/img/upload/image)

### 真实请求

**发起请求**

```bash
curl 'https://segmentfault.com/img/upload/image?_=eae38165c5d1dba3b81a5be2d30aa712' -H 'authority: segmentfault.com' -H 'pragma: no-cache' -H 'cache-control: no-cache' -H 'accept: */*' -H 'sec-fetch-dest: empty' -H 'x-requested-with: XMLHttpRequest' -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36' -H 'content-type: multipart/form-data; boundary=----WebKitFormBoundarygf8XEOBY56DN7QQP' -H 'origin: https://segmentfault.com' -H 'sec-fetch-site: same-origin' -H 'sec-fetch-mode: cors' -H 'referer: https://segmentfault.com/write' -H 'accept-language: zh-CN,zh;q=0.9,en;q=0.8' -H 'cookie: 登录凭证' --data-binary $'------WebKitFormBoundarygf8XEOBY56DN7QQP\r\nContent-Disposition: form-data; name="image"; filename="[a-z].png"\r\nContent-Type: image/png\r\n\r\n\r\n------WebKitFormBoundarygf8XEOBY56DN7QQP--\r\n' --compressed
```

**响应数据**

```json
[
    0,
    "/img/bVbFx8K",
    "/392/495/3924955958-5e86f4ffbdec3"
]
```

**生成示例**

```markdown
![\[a-z\].png](/img/bVbFx8K)

https://image-static.segmentfault.com/392/495/3924955958-5e86f4ffbdec3_articlex
```

### 模拟请求

**发起请求**

```bash
curl -i -X POST \
   -H 'Content-Type:multipart/form-data' \
   -H 'Referer: https://segmentfault.com/write' \
   -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36' \
   -H 'cookie: 登录凭证' \
   -F 'image=@"/Users/snowdreams1006/Documents/figure-bed/docs/images/0.jpg";type=image/jpeg;filename="0.jpg"' \
 'https://segmentfault.com/img/upload/image?_=eae38165c5d1dba3b81a5be2d30aa712'
```

**响应数据**

```json
[
    0,
    "/img/bVbFyb7",
    "/141/274/14127434-5e86fa367606f"
]
```
