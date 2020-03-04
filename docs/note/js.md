# js
## 继承
### class 继承
```js
class Parent {
  constructor(name) {
    this.name = name
    this.className = 'parent'
  } 
  toString() {
    return 'my name is ' + this.name
  }
}
class Child extends Parent {
  constructor(name) {
    // 必须调用super
    super(name)
    this.className = 'child'
  }
}
```

### 构造函数继承
调用 Parent 当作构造函数  
proto 没有指向 Parent
```js
function Child(name) {
  Parent.apply(this, arguments)
}
```

### 原型链继承
无法向父类传递参数  
构造函数会被重写
```js
function Parent(name) {
  this.name = name
  this.className = 'parent'
  this.toString = function() {
    return 'I have no name'
  }
}
function Child(name) {}
Child.prototype = new Parent()
Child.prototype.constructor = Child
```

### 组合继承
会调用两遍父类构造函数
```js
function Parent(name) {
  this.name = name
  this.className = 'parent'
  this.toString = function() {
    return 'my name is ' + this.name
  }
}
function Child(name) {
  // 调用第一遍
  Parent.apply(this, arguments)
  this.className = 'child'
}
// 调用第二遍
Child.prototype = new Parent()
Child.prototype.constructor = Child
```

### 寄生继承
```js
function extend(obj) {
  let clone = Object.create(obj)
  clone.toString = function() {
    return 'I am child'
  }
  return clone
}
const child = extend(parent)
```

### 组合+寄生继承
```js
function Child(name) {
  Parent.apply(this, arguments)
}
Child.prototype = Object.create(Parent.prototype)
Child.prototype.constructor = Child
```

## 事件捕获冒泡
![捕获冒泡](/捕获冒泡.png)
peventDefault
阻止默认事件，如超链接
stopPropagation 
阻止冒泡
