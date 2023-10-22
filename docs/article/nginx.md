# nginx 301 问题排查解析

## 起因

最近在银联云项目双域名改造的需求上，遇到了一件怪事。  
双域名改造，顾名思义，就是将页面改造成双域名 😅，当然为了节省资源，两个域名访问的都是同一套环境，同一台机器。  
改造的内容也就是简单的页面跳转，把原来写死的跳转链接，改造成根据浏览器环境来判断。

```js
// www.hct.com or login.hct.cn or blog.hct.com.cn
const s = window.location.hostname.split("hct")[1];
// hct
const domain = "hct" + s;

window.open("www." + domain);
```

在改造完开始测试时，就碰到了开头提到的怪事，在测试 cn 域名时，有时进入页面之后，后端接口会报用户未登录的错误。

## 排查

打开控制台，发现请求的后端接口域名变成了 com，由于我们数栈是通过 iframe 嵌套在银联云页面中的， 一开始手动输入数栈网址排查，页面都是正常请求了 cn 的后端接口。  
查看银联云 iframe 的 src，配置的也是 cn 的域名，但当我将 src 复制出来粘贴到地址栏之后，出现了这个现象。

![301](https://s1.huangchengtuo.com/img/20230531redirect.png)

可以看到第一个请求，给出了一个 301 的重定向状态码，并且响应头给出了一个新的 location，让页面从跳转到 cn 跳转到了 com，并给结尾带上了一个 `/`。  
在查看我们生产环境和我们的 devops 环境后，发现我们所有的产品，也都会在结尾带上一个 `/`。

![301](https://s1.huangchengtuo.com/img/20230601redirect.png)

![301](https://s1.huangchengtuo.com/img/20230607redirect.jpeg)

## / 的意义

首先肯定是要明白，结尾带 / 和不带 / 的 uri 分别是什么意思。

以终端的一条命令行为例：

- `/Users/hct/Desktop/index.html`  
  不带 /，意味着我们要查看或执行 index.html。至于这个 index.html，也不排除是个文件夹的可能 💩。
- `/Users/hct/Desktop/index.html/`  
  带上 /，意味着我们要访问 index.html 这个文件夹 😅，对 index.html 这个文件夹里面的东西进行一些操作。

在服务器内部或者 ftp 协议这种比较严格的远程服务上，对于 uri 的要求是非常严格的，写错路径的结尾就可能会拒绝访问，但在一些现代的 http 协议 web 服务器中，访问的 uri 就相对的随意但是复杂了。  
在现代 web 中，地址栏输入的链接，最后会展示什么，受到太多的东西控制了。

`protocol://hostname[:port]/path/[:parameters][?query]#fragment`  
在以前，`parameters` 不填写完整，返回的就是 404，现在服务器可以自动帮你返回 index.html。

hash 路由的 spa 项目，可以通过 `fragment` 来控制页面。  
在以前，一个 `parameters`就对应了一个 html 文件，现在 history 路由的 spa 项目，配合 web 服务器，能够做到拦截所有的 `parameters`，让一个 html 文件来控制所有 `parameters` 的变化。

## 为什么会 301？

导致 301 的原因，其实就是 `try_files` 这个配置项。在 nginx 的 location 中（*不确定是那个版本开始的*），有这样一条默认的 `try_files` 配置：  
`try_files $uri $uri/ =404;`  
在这条配置中，如果 `$uri` 访问的不是正确的文件，nginx 会在服务器内部先尝试访问 `$uri/`，搭配 nginx 自带的默认配置 `index index.html index.htm;`，nginx 会去匹配 `$uri/index.html`，如果命中，nginx 就会向浏览器返回 301，让浏览器重定向到 `$uri/`，正常访问页面。

![301](https://s1.huangchengtuo.com/img/20230707redirect.jpg)

当 nginx 的 `try_files` 依次匹配到最后一项时，nginx 将不会返回 301，而是直接内部重定向到最后一项，将结果返回给 `$uri/` 的请求。

![301](https://s1.huangchengtuo.com/img/20230707_404.jpg)

## history 模式

`protocol://hostname[:port]/path/[:parameters][?query]#fragment`  
众所周知，spa 应用的 hash 模式，是依靠浏览器的 # 锚点实现的，在服务器返回 html 文件后，spa 应用通过拦截 `fragment` 来读写前端路由目前的状态。  
history 模式，则是由浏览器直接拦截 `path` 和 `parameters` 来实现的。而浏览器的拦截，只能在获取到 html 之后，加载了必要的 js 才能开始生效，这就意味了第一次请求的时候，网址上的 `path` 很可能都是 404。  
这就需要后端 web 服务器进行对应的配置，让所有匹配不到的路径，都返回 spa 应用的 html 入口。  
`try_files $uri $uri/ /index.html;`

## 上层代理

明白了 301 的原理，现在就要回到一开始的问题，为什么 301 被重定向到了另一个域名。

![301](https://s1.huangchengtuo.com/img/20230531redirect.png)

经过一番排查，可以得出我们的 nginx 配置并没有什么问题，只能推测是上层的 nginx 的配置导致了问题。  
由于没有查看上层配置的权限，只能自己简单搭建一个来模拟一下两层 nginx 和 多个域名指向同一 ip 时的配置

```conf
server {
  listen 80;
  server_name localhost 192.168.97.247;

  location / {
    rewrite / /insider permanent;
  }

  location /insider {
    alias /Users/hct/Desktop/personal/insider;
  }
}

server {
  listen 80;
  server_name local.devops.dtstack.com local.devops.dtstack.cn;

  location / {
    proxy_pass http://localhost:8080;
  }
}
# 用另一端口模拟别的机器
server {
  listen 8080;
  server_name_in_redirect off;
  server_name foo;

  location / {
    rewrite / /nested permanent;
  }

  location /nested {
    alias /Users/hct/Desktop/personal/nested;
    index index.html index.htm;
    autoindex on;
  }
}
```

# 草稿

## root alias 区别

root 会带上 location 匹配到的 url，alias 不会

## absolute_redirect server_name_in_redirect port_in_redirect

## 同 ip 不同域名
