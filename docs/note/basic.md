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
