# 数据结构&算法
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

## 防抖
防止一定时间内重复点击
```js
const debounce = (fn, wait = 500) => {
   let timer = null
   return function() {
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
  return function() {
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
  return function() {
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
  return function() {
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
### diff算法
![diff](https://s1.huangchengtuo.com/img/0416diff.png)    
分别对 oldS、oldE、newS、newE 两两比较
* 新旧 S 和 E 自行比较，相同则指针往中间移动
* oldS 与 newE 相同，则 oldS 移至 oldE 后面
* oldE 与 newS 相同，则 oldE 移至 oldS 前面
* 如果存在 key，则根据 oldVnode 的 key 生成一张哈希表，用 newS 的 key 匹配，判断是否为 sameNode，是的话将节点移至最前面，不是就生成新 node 插入 oldS 位置  

如果没有 key，直接将 newS 插入真实 DOM 后面  

最先遍历完后将剩余节点排到最后或移除