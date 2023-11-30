# js

## 类型

### 基本类型

`number`，`string`，`boolean`，`BigInt`，`Symbol`，`null`，`undefined`

### 引用类型

`object`、`Array`、`Function`...

### 判断类型

**typeof**

只输出 number，boolean，string，function，object，undefined  
NaN 也输出 number  
引用类型（数组、正则）只输出 object

**instanceof**

用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上

**call**

```js
Object.prototype.toString.call()
console.log(toString.call(123)) //[object Number]
console.log(toString.call("123")) //[object String]
console.log(toString.call(undefined)) //[object Undefined]
console.log(toString.call(true)) //[object Boolean]
console.log(toString.call({})) //[object Object]
console.log(toString.call([])) //[object Array]
console.log(toString.call(function () {})) //[object Function]
```

## 原型链

![原型链](https://s1.huangchengtuo.com/img/0420prototype.png)

- Object 是所有对象的爸爸，所有对象都可以通过 **proto** 找到它
- Function 是所有函数的爸爸，所有函数都可以通过 **proto** 找到它
- 对象的 **proto** 属性指向原型， **proto** 将对象和原型连接起来组成了原型链
- js 分为函数对象和普通对象，每个对象都有 **proto** 属性，但是只有函数对象才有 prototype 属性
- 函数的 prototype 是一个对象
- 函数的 prototype 指向了一个对象，而这个对象正是调用构造函数时创建的实例的原型

![原型链](https://s1.huangchengtuo.com/img/231129proto.png)

## 继承

prototype 的继承就是 js 的糟粕，能用 class 就用 class

### class 继承

```js
class Parent {
  constructor(name) {
    this.name = name
    this.className = "parent"
  }

  toString() {
    return "my name is " + this.name
  }
}

class Child extends Parent {
  constructor(name) {
    // 必须调用super
    super(name)
    this.className = "child"
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
  this.className = "parent"
  this.toString = function () {
    return "I have no name"
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
  this.className = "parent"
  this.toString = function () {
    return "my name is " + this.name
  }
}

function Child(name) {
  // 调用第一遍
  Parent.apply(this, arguments)
  this.className = "child"
}

// 调用第二遍
Child.prototype = new Parent()
Child.prototype.constructor = Child
```

### 寄生继承

```js
function extend(obj) {
  let clone = Object.create(obj)
  clone.toString = function () {
    return "I am child"
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

## new 对象的过程

- 创建一个空对象
- 让空对象的 _proto_ 指向构造函数的 prototype
- 执行构造函数中的代码（为这个新对象添加属性）
- 返回新对象

## 暂时性死区

```js
console.log(num)
var num = 1
```

等价于

```
var num
console.log(num)
num = 1
```

let 和 const 能生成暂时性死区，提前使用会抛出错误

## 性能指标

[来来来，前端性能监控，带你拿到正确的性能指标](https://juejin.cn/post/7223280402475089978)
