# 浏览器

## 浏览器进程

![进程](https://s1.huangchengtuo.com/img/0418browser.png)
js 线程和 gui 线程互斥，js 线程运行时会阻塞 gui 线程  
事件触发线程归属于浏览器而不是 js 引擎,用来控制事件循环  
当对应的事件符合触发条件被触发时,该线程会把事件添加到待处理队列的队尾（事件循环）

## 渲染流程

![渲染流程](https://s1.huangchengtuo.com/img/231114render.png)

DOM 树渲染到 script 标签后就会停止，js 引擎开始工作

![渲染流程](https://s1.huangchengtuo.com/img/231114script.jpg)

多个带 async 属性的标签，不能保证加载的顺序，多个带 defer 属性的标签，按照加载顺序执行

## 事件循环

js 引擎是单线程的，只有一个 FILO 的执行栈。  
遇到异步操作放入 task 队列或者 microtask 队列，执行完执行栈后先执行 microtask 队列中微任务，再执行 task 队列中宏任务队列。  
宏任务执行结束后会对页面重新渲染  
微任务会在一个宏任务执行结束，下一个宏任务执行前执行
![事件循环](https://s1.huangchengtuo.com/img/0416eventLoop.png)

## 垃圾回收

### 标记清除 👍

从根对象出发，找出所有从根开始引用的对象，然后找出这些对象引用的对象，找出未被引用的对象进行回收。

### 引用计数 👎

回收引用次数为零的对象。如果循环引用或者互相引用就无法被回收

### 内存泄漏的情况

全局变量  
闭包  
定时器  
DOM 节点的引用  
未声明直接赋值的变量将会变成全局变量，在页面关闭前不会被回收。  
this 也有可能创建全局变量

```js
function foo() {
  this.variable = "potential accidental global";
} // foo 调用自己，this 指向了 window，通过严格模式避免
foo();
```

## 跨域

协议、域名、端口有一个不同就是跨域

### proxy

使用 node 或者 nginx 直接代理请求，最方便

### JSONP

通过 script 标签提供一个回调函数从地址获取数据，只限于 get 请求。

```js
<script src="http://www.api.com/login?id=114514&callback=action"></script>
<script>
  const action = (res) => {
  // 处理数据
}
</script>
```

### CORS

服务端设置 Access-Control-Allow-Origin 字段允许跨域  
携带 cookie 需要 withCredentials 字段

### 简单请求

请求方法满足是以下三种方法，

- HEAD
- GET
- POST

Content-Type 的值仅限于下列三者

- text/plain
- multipart/form-data
- application/x-www-form-urlencoded

### 复杂请求

会发起 option 预检请求

## 缓存

页面的缓存状态由 header 决定，根据 header 确定是否命中

![缓存](https://s1.huangchengtuo.com/img/0416cache.png)

**强缓存**  
命中则直接从本地获取缓存，不向服务端请求  
`200 OK (from memory cache)`

**协商缓存**  
没有命中（如过期）则向服务器请求，若服务端未更新则重定向至本地缓存  
`304 Not Modified`

**header 字段**  
Cache-Control: max-age/s-maxage/public/private/no-cache/no-store/must-revalidate  
Expires: 缓存过期时间  
Last-modified: 服务器端文件的最后修改时间  
Etag: hash 字符串，标识资源的状态，由服务端产生

[浏览器缓存 - Javascript 编程基础 - SegmentFault 思否](https://segmentfault.com/a/1190000008377508)

## 事件捕获冒泡

![捕获冒泡](https://s1.huangchengtuo.com/img/0416捕获冒泡.png)

peventDefault 阻止默认事件，如超链接  
stopPropagation 阻止冒泡

## Event 的 target currentTarget

target：点击的元素  
currentTarget：触发的元素

<!-- TODO -->

## 事件委托 + DocumentFragment 优化大量节点
