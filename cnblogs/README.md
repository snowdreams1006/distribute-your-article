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
   -H 'Cookie: _ga=GA1.2.1742428059.1583216565; __gads=ID=fa75e36e853009fe:T=1583216566:S=ALNI_Ma-TqGhQV_KSoMVVBmv_Z_2aVSudA; UM_distinctid=170c8189f906af-07613e93fb573e-3a36540e-144000-170c8189f917f4; .Cnblogs.AspNetCore.Cookies=CfDJ8Nf-Z6tqUPlNrwu2nvfTJEj8dcmT8e60fqYzQVPonNG6ZFSoeXTfX7CLjzeFZIoj4ZvVxGKH1lCJskmoUp32tHdPH_VyQw8YpyNfUuviT5_DME-OmxbAPs3hNno1rk3pFnEoas5jJyyRzHI-d7PV71cV3xxaIm6GtgbMKq-pjkuV1vvghyDfCWasNYNIT2Op-FFAafIpTkU6j3Zc_JuwZu9gpqCGVsJqWMSNNLxH6dBsYe0s-vCzWOuGuBMmfzBaSiVKhIM4kHmbWMVpaJRhnUjAbj2earY8q9w1MFUEQVR5Qh3qWShHJ8MJTufwZ5DO3WshCNgwtKkf1WwxFc3rkkR275IZpzqz1eNu5gW2JKHaFlnhLi3g-VGOC2zi1OIuV7TlmstY4j8SRvXwikoQWRKSPhfWqI5Fz3YS0oTZV-Ad2R-FjGhPECIfZMdXb0hAyQztp8fuTjRk0JQGpBm1VKCeBYlpxTe9kCc-yvGBslOOqmxIY9Fs9-xXGTYYzD17hPlPDtFh8Pjtymg06ho9adS-wM5HJgVEkQaR2joOd4qk1G4gzISnUFkgjsFWT_CBAQ; .CNBlogsCookie=17174B7AEC38EF0CE3A2912C358B2A19717AA86876AF9665FF09597D834B7972A3A31BD4D463F49A4247A5AF20FF82B2DDE23663F0F973BEFB99C36C22C1CEE291F8D25929E7B9949483E5ED737AE81FD35DB332ECE545F5B49917FD16F0F029DBBE0896; _gid=GA1.2.944205224.1585725999' \
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
