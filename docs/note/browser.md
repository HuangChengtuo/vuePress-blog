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

### 浏览器环境

js 引擎是单线程的，只有一个 FILO 的执行栈。  
遇到异步操作放入 task 队列或者 microtask 队列，执行完执行栈后先执行 microtask 队列中微任务，再执行 task 队列中宏任务队列。  
宏任务执行结束后会对页面重新渲染  
微任务会在一个宏任务执行结束，下一个宏任务执行前执行

![事件循环](https://s1.huangchengtuo.com/img/0416eventLoop.png)

宏任务是由宿主环境发起的，比如浏览器、Node 等  
微任务是由 JS 引擎发起的  
Object.observe 观察对象变化  
MutationObserver 观察 DOM 变化

### node 环境

![事件循环](https://s1.huangchengtuo.com/img/231129eventLoop.png)

- timers 阶段：这个阶段执行 timer（setTimeout、setInterval）的回调
- I/O callbacks 阶段：处理一些上一轮循环中的少数未执行的 I/O 回调
- idle, prepare 阶段：仅 node 内部使用
- poll 阶段：获取新的 I/O 事件, 适当的条件下 node 将阻塞在这里
- check 阶段：执行 setImmediate() 的回调
- close callbacks 阶段：执行 socket 的 close 事件回调

微任务会在事件循环的各个阶段之间执行  
process.nextTick 独立于 Event Loop 之外的，它有一个自己的队列，当每个阶段完成后，如果存在 nextTick 队列，就会清空队列中的所有回调函数，并且优先于其他 microtask 执行

## 垃圾回收

### 标记清除 👍

从根对象出发，找出所有从根开始引用的对象，然后找出这些对象引用的对象，找出未被引用的对象进行回收。

### 引用计数 👎

回收引用次数为零的对象。如果循环引用或者互相引用就无法被回收

### V8 分代式垃圾回收

![v8回收](https://s1.huangchengtuo.com/img/231123gc.png)

新加入的对象都会存放到使用区，当使用区快被写满时，就需要执行一次垃圾清理操作  
当开始进行垃圾回收时，新生代垃圾回收器会对使用区中的活动对象做标记，标记完成之后将使用区的活动对象复制进空闲区并进行排序，随后进入垃圾清理阶段，即将非活动对象占用的空间清理掉。最后进行角色互换，把原来的使用区变成空闲区，把原来的空闲区变成使用区  
当一个对象经过多次复制后依然存活，它将会被认为是生命周期较长的对象，随后会被移动到老生代中，采用老生代的垃圾回收策略进行管理  
老生代就是用标记清除

### 内存泄漏的情况

全局变量  
闭包  
定时器  
DOM 节点的引用  
未声明直接赋值的变量将会变成全局变量，在页面关闭前不会被回收。  
this 也有可能创建全局变量

```js
function foo() {
  this.variable = "potential accidental global"
} // foo 调用自己，this 指向了 window，通过严格模式避免
foo()
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

## iframe 通信

### url 传参

痛过 query、hash 通知子页面，`window.onhashchange` 感知 hash 变化

### postMessage

window.open 也可以使用 postMessage

```js
window.postMessage("Hello world!", "http://127.0.0.1:5500/child.html")

window.addEventListener("message", function (event) {
  // 判断消息是否来自可信任的源
  if (event.origin === "http://127.0.0.1:5500/child.html") {
    console.log("message: " + event.data)
  }
})
```

### 直接获取 DOM

会受到同源策略限制

```js
document.getElementById().contentWindow.document

window.parent.document
```

## Web Workers

```js
const myWorker = new Worker("worker.js")
myWorker.postMessage("asd")
myWorker.onmessage = (e) => {
  console.log(e.data)
}
myWorker.terminate()

// worker.js
onmessage = (e) => {
  console.log(e.data)
  postMessage("qwe")
}
this.close()
```

### 与主线程的区别

Web Workers 和主线程之间的一个关键区别是 Web Workers 没有访问 DOM 或 UI 的权限。这意味着它不能直接操作页面上的 HTML 元素或与用户交互。实际上，Web Workers 被设计用于执行不需要直接访问 UI 的任务，例如数据处理、图像操作或计算  
另一个区别是，Web Workers 被设计为在与主线程分离的沙箱环境中运行，这意味着它们对系统资源的访问受到限制，并且不能访问某些 API，如 localStorage 或 sessionStorage API。不过，它可以通过消息传递系统与主线程进行通信，从而允许两个线程之间交换数据

## 服务器发送事件 Server-Sent Event

```js
// http 长连接
const evtSource = new EventSource("//api.example.com/ssedemo.php", { withCredentials: true })

// onopen onerror
evtSource.onmessage = (e) => {
  console.log(e.data)
}

evtSource.close()
```

### 与 WebSocket 比较

- 数据推送方向：SSE 是服务器向客户端的单向通信，服务器可以主动推送数据给客户端。而 WebSocket 是双向通信，允许服务器和客户端之间进行实时的双向数据交换。

- 连接建立：SSE 使用基于 HTTP 的长连接，通过普通的 HTTP 请求和响应来建立连接，从而实现数据的实时推送。WebSocket 使用自定义的协议，通过建立 WebSocket 连接来实现双向通信。

- 兼容性：由于 SSE 基于 HTTP 协议，它可以在大多数现代浏览器中使用，并且不需要额外的协议升级。WebSocket 在绝大多数现代浏览器中也得到了支持，但在某些特殊的网络环境下可能会遇到问题。

## 事件委托 + DocumentFragment 优化大量节点
