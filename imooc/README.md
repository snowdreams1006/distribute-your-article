## 上传图片 [/article/ajaxuploadimg](https://www.imooc.com/article/ajaxuploadimg)

### 真实请求

**发起请求**

```bash
curl 'https://www.imooc.com/article/ajaxuploadimg' -H 'Connection: keep-alive' -H 'Pragma: no-cache' -H 'Cache-Control: no-cache' -H 'Sec-Fetch-Dest: empty' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36' -H 'Content-Type: multipart/form-data; boundary=----WebKitFormBoundary4pPsPZhJjaycVHmA' -H 'Accept: */*' -H 'Origin: https://www.imooc.com' -H 'Sec-Fetch-Site: same-origin' -H 'Sec-Fetch-Mode: cors' -H 'Referer: https://www.imooc.com/article/publish' -H 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8' -H 'Cookie: zg_did=%7B%22did%22%3A%20%2217058c748ec25-07a06557fd67d2-396b7002-fa000-17058c748ed267%22%7D; imooc_uuid=24d00e6f-50ca-4e21-87b9-b96573ad9bca; imooc_isnew_ct=1582037420; imooc_isnew=2; redrainTime=2020-3-8; loginstate=1; Hm_lvt_f0cfcccd7b1393990c78efdeebff3968=1583605280,1585116811,1585579697,1585795558; UM_distinctid=17138ccb2c59-0277009cb09f78-396d7f06-fa000-17138ccb2c6b8f; CNZZDATA1261728817=1410490128-1585794468-%7C1585794468; Hm_lvt_c92536284537e1806a07ef3e6873f2b3=1583214957,1585795929; Hm_lpvt_c92536284537e1806a07ef3e6873f2b3=1585795929; connect.sid=s%3AhxfKgZ75g3qbbKWT8k-z6d3ZlT_xk_OI.1A4OlJ03SdjsCPKelH6sGCYKUVAwplYHPJRVvtqLixo; apsid=AxYTdlYTFjOWVjZTdiNzU3MzZlNWRhZTNiNmZiY2IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANTIyNDQ4OAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABzbm93ZHJlYW1zMTAwNkAxNjMuY29tAAAAAAAAAAAAAGZiMGM3NDI4NzA1NDM1MzE4M2NkNDcwOTEwMWYxMzcA3YKFXt2ChV4%3DNz; IMCDNS=1; zg_f375fe2f71e542a4b890d9a620f9fb32=%7B%22sid%22%3A%201585844047552%2C%22updated%22%3A%201585844047552%2C%22info%22%3A%201585646589523%2C%22superProperty%22%3A%20%22%7B%5C%22%E5%BA%94%E7%94%A8%E5%90%8D%E7%A7%B0%5C%22%3A%20%5C%22%E6%85%95%E8%AF%BE%E7%BD%91%E6%95%B0%E6%8D%AE%E7%BB%9F%E8%AE%A1%5C%22%2C%5C%22Platform%5C%22%3A%20%5C%22web%5C%22%7D%22%2C%22platform%22%3A%20%22%7B%7D%22%2C%22utm%22%3A%20%22%7B%7D%22%2C%22referrerDomain%22%3A%20%22www.imooc.com%22%2C%22cuid%22%3A%20%22so1BKmB9E6U%2C%22%2C%22zs%22%3A%200%2C%22sc%22%3A%200%2C%22firstScreen%22%3A%201585844047552%7D; Hm_lpvt_f0cfcccd7b1393990c78efdeebff3968=1585844048; cvde=5e4bf9ac96fda-198' --data-binary $'------WebKitFormBoundary4pPsPZhJjaycVHmA\r\nContent-Disposition: form-data; name="id"\r\n\r\nWU_FILE_0\r\n------WebKitFormBoundary4pPsPZhJjaycVHmA\r\nContent-Disposition: form-data; name="name"\r\n\r\ndemo-verify-data-result.png\r\n------WebKitFormBoundary4pPsPZhJjaycVHmA\r\nContent-Disposition: form-data; name="type"\r\n\r\nimage/png\r\n------WebKitFormBoundary4pPsPZhJjaycVHmA\r\nContent-Disposition: form-data; name="lastModifiedDate"\r\n\r\nThu Mar 26 2020 10:54:31 GMT+0800 (中国标准时间)\r\n------WebKitFormBoundary4pPsPZhJjaycVHmA\r\nContent-Disposition: form-data; name="size"\r\n\r\n76736\r\n------WebKitFormBoundary4pPsPZhJjaycVHmA\r\nContent-Disposition: form-data; name="photo"; filename="demo-verify-data-result.png"\r\nContent-Type: image/png\r\n\r\n\r\n------WebKitFormBoundary4pPsPZhJjaycVHmA--\r\n' --compressed
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
