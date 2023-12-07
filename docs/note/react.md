# React

## JSX.Element 与 React.ReactNode 与 React.ReactElement

jsx 文件就是实现`React.createElement()`的一个语法糖。
`React.createElement`方法会根据传入`type`的类型来区分返回普通的`HTMLElement`或者是`React.ReactElement`实例

`React.ReactElement`在使用上就是一个含有`type`、`props`、`key`的实例对象，由 React 最终渲染成真实的 DOM 元素

```ts
// index.d.ts
interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
  type: T
  props: P
  key: Key | null
}

// Playground.tsx
const element: React.ReactElement = React.createElement("div", { className: "test", id: "unique" }, "hello world")
ReactDOM.render(element, document.getElementById("render-container"))
console.log(element)
```

实际的 ReactElement 对象则具有以下元素：![ReactElement](https://s1.huangchengtuo.com/img/210615reactElement.png)

`React.ReactNode` 是一种联合类型，并且继承了`React.ReactElement`

```ts
type ReactText = string | number
type ReactChild = ReactElement | ReactText
// ...
type ReactNode = ReactChild | ReactFragment | ReactPortal | boolean | null | undefined
```

`JSX.Element`就是通过继承`React.ReactNode`实现的，没有任何区别

## 区分 class 组件和 function 组件

[How Does React Tell a Class from a Function?](https://overreacted.io/how-does-react-tell-a-class-from-a-function/)

### 为什么要区分

箭头函数的组件没有 this，new 会报错

### 怎么区分

class 组件 会继承 `React.Component`，`MyComponent instanceof React.Component`

```js
// Inside React
class Component {}
Component.prototype.isReactComponent = {}

// We can check it like this
class Greeting extends Component {}
console.log(Greeting.prototype.isReactComponent)
```

## ref

### class 组件

```jsx
import React from "react"

export default class Test extends React.Component {
  ref = React.createRef()

  componentDidUpdate() {
    this.ref.current.focus()
  }

  render() {
    return <input ref={this.ref} />
  }
}
```

### 函数组件

```jsx
import { useRef } from "react"

export default function Test() {
  const ref = useRef()

  useEffect(() => {
    this.ref.current.focus()
  }, [])

  return <input ref={this.ref} />
}
```

函数组件不会暴露出自己的实例，需要使用 `forwardRef ` 来包装组件

```jsx
import { forwardRef, useImperativeHandle } from "react"

function Child(props, ref) {
  useImperativeHandle(ref, () => {
    return {
      onXXX,
      onResetXXX,
      XXX,
    }
  })

  return <>...</>
}

export default forwardRef(Child)
```

## Fiber

![tree](https://s1.huangchengtuo.com/img/231123tree.png)

由于 react 和 vue 的响应式实现原理不同，react 每次更新都需要渲染一颗更大的虚拟 DOM 树

![fiber tree](https://s1.huangchengtuo.com/img/231123fiberTree.png)

在 fiber 出现之前，react 的虚拟 DOM 树只有指向子节点的指针，所以中断渲染，暂存当前的 DOM 节点信息就会丢失父节点和兄弟节点的信息，无法完成遍历  
通过 requestIdleCallback 来控制遍历的进度条，决定是否让出线程给其他操作

React 中最多会存在两颗 Fiber 树

- currentFiber：页面中显示的内容
- workInProgressFiber：内存中正在重新构建的 Fiber 树

## Hooks 链表

### hooks mount 阶段

当函数式组件初始化时，会调用 `renderWithHooks` 函数，初始化走 `HooksDispatcherOnMount`，后续更新走 `HooksDispatcherOnUpdate`

初始化时，会调用 `mountWorkInProgressHook ` 创建 hook 链表节点，挂载到 fiber 节点的 `memoizedState` 上（Fiber 上的 `memoizedState` 指向 hooks 链表，hook 身上的 `memoizedState` 存储他们自己的状态）

### hooks update 阶段

调用 `updateWorkInProgressHook` 克隆 hook 节点，进行新旧比较

第一部分：由 `nextCurrentHook` 中间变量 记录旧的 hooks 链表  
第二部分：由 `nextWorkInProgressHook` 中间变量 克隆旧的 hook 节点形成新的 hooks 链表  
第三部分：currentHook 指向旧 hooks 链表；`workInProgressHook` 指向新的 hooks 链表，返回 `workInProgressHook`

## [彻底搞懂 React 18 并发机制的原理](https://juejin.cn/post/7171231346361106440)
