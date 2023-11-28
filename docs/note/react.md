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

## AntD 的 Event 的 ts 类型

TypeScript 一大作用就是为了提供精准的代码提示

当方法内联于 antd 元素中，Event 能够得到良好的代码提示

比如用到最多的`e.target.value`这个值在 ts 的提示下最少 5 次敲击内输入完整的代码  
![内联方法](https://s1.huangchengtuo.com/img/210615inline.gif)

但当通过引用来传入方法，不进行正确的类型标记，形参就会隐式的变为 any 类型，失去原有的 ts 提示

```tsx
// e implicitly has any type
const onChange = (e) => {
  console.log(e?.target?.value)
}
// ...
;<Input onChange={onChange} />
```

这时就需要手动对方法的形参的类型进行标注

- `Input.onChange(e: React.ChangeEvent<HTMLInputElement>)`
- `Radio.Group.onChange(e: antd.RadioChangeEvent)`
- `Checkbox.onChange(e: antd.CheckboxChangeEvent)`
- `Button.onClick(e: React.MouseEvent)`
- `Select.onChange(value: string, option:Option)`

## React Router 的 Hooks 与 HOC 用法

当组件被传入`Route.component`时，路由相关信息会直接注入 props 中  
![router hook](https://s1.huangchengtuo.com/img/210622router-props.png)  
当组件没有直接被 Route 包裹，又需要调用路由的相关方法或获取路由信息时，就需要另作处理

### Hooks

React Router 从 v5.1.0 开始，新增了对 Hooks 的支持，并陆续添加了四个钩子函数

- `useHistory`
- `useLocation`
- `useParams`
- `useRouteMatch`

```jsx
import { useHistory, useLocation, useParams } from "react-router-dom"

export default function Playground() {
  const router = useHistory()
  // useHistory().location 和 useLocation() 数据结构都是一致的
  const route = useLocation() || router.location
  // 获取 url 中的参数 /playground/:id
  const params = useParams()

  function jump() {
    router.push("...")
  }

  return <>...</>
}
```

useHistory 提供的方法，基本与 class 一致  
![router hook](https://s1.huangchengtuo.com/img/210622router-hook.png)

[Hooks 文档地址](https://reactrouter.com/web/api/Hooks)

### HOC

使用`withRouter`对组件进行包裹，生成一个高阶组件，在原组件的 props 里添加相应的路由属性与方法

```tsx
// index.d.ts
export interface RouteComponentProps<
  Params extends { [K in keyof Params]?: string } = {},
  C extends StaticContext = StaticContext,
  S = H.LocationState
> {
  history: H.History<S>
  location: H.Location<S>
  match: match<Params>
  staticContext?: C
}

// playground.tsx
import { withRouter, RouteComponentProps } from "react-router-dom"

interface Props extends RouteComponentProps {
  text: string
  // ...
}

class BlockA extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
    console.log(props)
  }

  render() {
    return <div>block a</div>
  }
}

const WithRouterBlockA = withRouter(BlockA)
export default WithRouterBlockA
```

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

## Fiber

![tree](https://s1.huangchengtuo.com/img/231123tree.png)

由于 react 和 vue 的响应式实现原理不同，react 每次更新都需要渲染一颗更大的虚拟 DOM 树

![fiber tree](https://s1.huangchengtuo.com/img/231123fiberTree.png)

在 fiber 出现之前，react 的虚拟 DOM 树只有指向子节点的指针，所以中断渲染，暂存当前的 DOM 节点信息就会丢失父节点和兄弟节点的信息，无法完成遍历  
通过 requestIdleCallback 来控制遍历的进度条，决定是否让出线程给其他操作

React 中最多会存在两颗 Fiber树

- currentFiber：页面中显示的内容
- workInProgressFiber：内存中正在重新构建的 Fiber树

## Hooks 链表

### hooks mount 阶段

当函数式组件初始化时，会调用 `renderWithHooks` 函数，初始化走 `HooksDispatcherOnMount`，后续更新走 `HooksDispatcherOnUpdate`  

初始化时，会调用 `mountWorkInProgressHook ` 创建 hook 链表节点，挂载到 fiber 节点的 `memoizedState` 上（Fiber 上的 `memoizedState` 指向 hooks 链表，hook 身上的 `memoizedState` 存储他们自己的状态）

### hooks update 阶段

调用 `updateWorkInProgressHook` 克隆 hook 节点，进行新旧比较

第一部分：由 `nextCurrentHook` 中间变量 记录旧的 hooks 链表  
第二部分：由 `nextWorkInProgressHook` 中间变量 克隆旧的 hook 节点形成新的 hooks 链表  
第三部分：currentHook 指向旧 hooks链表；`workInProgressHook` 指向新的 hooks 链表，返回 `workInProgressHook`
