# 计算机通用

## 排序

### 快速排序

```js
const quickSort = (arr) => {
  if (arr.length <= 1) {
    return arr
  }
  const left = []
  const right = []
  const pivot = arr[0]
  for (let i = 1; i < arr.length; i++) {
    arr[i] < pivot ? left.push(arr[i]) : right.push(arr[i])
  }
  return [...quickSort(left), pivot, ...quickSort(right)]
}
```

选择一个节点，比它小的放左边，比它大的放右边，不断重复

### 冒泡排序

![冒泡排序](https://s1.huangchengtuo.com/img/231128popSort.gif)

## 防抖

防止一定时间内重复点击

```js
const debounce = (fn, wait = 500) => {
  let timer = null
  return function () {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments)
    }, wait)
  }
}
```

**立即执行版**

```js
const debounce = (fn, wait = 500) => {
  let timer = null
  let loading = false
  return function () {
    if (loading) {
      clearTimeout(timer)
    } else {
      loading = true
      fn.apply(this, arguments)
    }
    timer = setTimeout(() => {
      loading = false
    }, wait)
  }
}
```

## 节流

连续高频调用改为间隔调用  
**时间戳**

```js
const throttle = (fn, wait = 500) => {
  let lastTime = new Date()
  return function () {
    if (new Date() - lastTime > wait) {
      fn.apply(this, arguments)
      lastTime = new Date()
    }
  }
}
```

**定时器**

```js
const throttle = (fn, wait = 500) => {
  let loading = false
  return function () {
    if (!loading) {
      loading = true
      fn.apply(this, arguments)
      setTimeout(() => {
        loading = false
      }, wait)
    }
  }
}
```

## diff

diff 算法会逐层进行比较，但只会同层级之间比较，为了性能，当同层级节点不同就直接替换，不会继续比较子节点，无论子节点是否相同  
![vdom](https://s1.huangchengtuo.com/img/0416vdom.png)

### patch

![patch](https://s1.huangchengtuo.com/img/0416patch.png)

1. 当数据发生改变时，set 方法会让调用 Dep.notify 通知所有订阅者 Watcher，订阅者就会调用 patch 给真实的 DOM 打补丁，更新相应的视图。
2. patch 接收新旧节点判断是否需要两个节点是否一样，一样就调用 patchVnode 比较子节点，不一样就完全替换旧节点
3. patchVnode 前三种情况都直接进行 patch，都有子节点则进行 diff

### diff 算法

![diff](https://s1.huangchengtuo.com/img/0416diff.png)  
分别对 oldS、oldE、newS、newE 两两比较

- 新旧 S 和 E 自行比较，相同则指针往中间移动
- oldS 与 newE 相同，则 oldS 移至 oldE 后面
- oldE 与 newS 相同，则 oldE 移至 oldS 前面
- 如果存在 key，则根据 oldVnode 的 key 生成一张哈希表，用 newS 的 key 匹配，判断是否为 sameNode，是的话将节点移至最前面，不是就生成新 node 插入 oldS 位置

如果没有 key，直接将 newS 插入真实 DOM 后面

最先遍历完后将剩余节点排到最后或移除

## http 状态码

200 OK  
201 Created  
301 Moved Permanently  
302 Move Temporarily  
304 Not Modified  
400 Bad Request  
401 Unauthorized 无权限  
403 Forbidden 拒绝执行  
404 Not Found  
500 Internal Server Error  
502 Bad Gateway  
504 Gateway Timeout

## 网络模型

![diff](https://s1.huangchengtuo.com/img/231123osi.gif)

应用层：HTTP、SSH、FTP  
传输层：TCP、UDP  
网络层：IP、ARP
物理层：以太网、蓝牙、wifi

## Git Hooks

[前端 Git-Hooks 工程化实践](https://juejin.cn/post/7114170606609760286)

### 原生 Git Hooks

`.git/hooks` 文件夹中有实例文件，去掉 `.sample` 后缀即可生效，但是 `.git` 文件夹不会被 git 追踪，没法保证所有人的仓库都有

### Husky

安装 Husky 会生成 .husky 文件夹，编写 shell 文件通过 node 执行 js 文件，遇到问题 `process.exit(1)`

<!-- 单测 -->

## [聊聊单点登录(SSO)中的CAS认证](https://juejin.cn/post/7143566954597449759)
