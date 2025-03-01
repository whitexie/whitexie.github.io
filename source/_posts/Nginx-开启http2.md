---
title: Nginx-开启http2
date: 2025-03-01 15:44:45
tags:
  - nginx
  - http2
  - cloudflare
---

## 环境
- 域名DNS使用的`cloudflare`
- 开启`cloudflare`https代理

## 创建证书

1. 登录`cloudflare`, 打开站点，在左侧菜单选择 `SSL/TLS` -> `源服务器`，然后点击创建证书。

![](/images/image-1740815426050.png)

2. 使用默认的私钥类型`ras(2048)`，点击`创建`
![](/images/image-1740815589294.png)

3. 这个时候会生成`源证书`和`私钥`，创建文件`you-domain.pem`和`you-domain.key`。
   1. 复制`源证书`的内容到`you-domain.pem`中；
   2. 复制`私钥`的内容到`you-domain.key`中。
![](/images/image-1740815852797.png)


## 设置加密模式
> 需要将`Cloudflare`连接服务器的加密模式设置成`完全`、`安全（严格）`或者`严格（仅 SSL 源服务器拉取）`。

操作入口： 左侧菜单：`SSL/TLS` -> `概述`，点击`配置`。
![](/images/image-1740816140596.png)

选择`自定义SSL/TLS`，模式可以选`完全`、`安全（严格）`或者`严格（仅 SSL 源服务器拉取）`。
![](/images/image-1740816240558.png)



## 配置Nginx

1. 把刚才保存的`pem`和`key`上传到服务器，一般放在`/etc/nginx/certs`目录下

2. 修改`Nginx`配置 
```nginx
server {
  listen 443 ssl http2;
  
  ssl_certificate /etc/nginx/certs/you-domain.pem;
  ssl_certificate_key /etc/nginx/certs/you-domain.key;
}
```

检查配置，然后重启nginx
```bash
nginx -t

nginx -s reload
```

到此结束...
