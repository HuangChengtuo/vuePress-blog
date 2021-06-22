# React

## JSX.Element 与 React.ReactNode 与 React.ReactElement

jsx 文件就是有关`React.createElement()`的一个语法糖。
`React.createElement`方法会根据传入`type`的类型来区分返回普通的`HTMLElement`或者是`React.ReactElement`实例

`React.ReactElement`在使用上就是一个含有`type`、`props`、`key`的实例对象，由 React 最终渲染成真实的 DOM 元素

```ts
// index.d.ts
interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
  type: T;
  props: P;
  key: Key | null;
}

// Playground.tsx
const element: React.ReactElement = React.createElement('div', { className: 'test', id: 'unique' }, 'hello world')
ReactDOM.render(element, document.getElementById('render-container'))
console.log(element)
```

实际的 ReactElement 对象则具有以下元素：![ReactElement](https://s1.huangchengtuo.com/img/210615reactElement.png)

`React.ReactNode` 是一种联合类型，并且继承了`React.ReactElement`

```ts
type ReactText = string | number;
type ReactChild = ReactElement | ReactText;
// ...
type ReactNode = ReactChild | ReactFragment | ReactPortal | boolean | null | undefined;
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
const onChange = e => {
  console.log(e?.target?.value)
}
// ...
<Input onChange={onChange} />
```

这时就需要手动对方法的形参的类型进行标注

* `Input.onChange(e: React.ChangeEvent<HTMLInputElement>)`
* `Radio.Group.onChange(e: antd.RadioChangeEvent)`
* `Checkbox.onChange(e: antd.CheckboxChangeEvent)`
* `Button.onClick(e: React.MouseEvent)`
* `Select.onChange(value: string, option:Option)`

## React Router 的 Hooks 与 HOC 用法

当组件被传入`Route.component`时，路由相关信息会直接注入 props 中  
![router hook](https://s1.huangchengtuo.com/img/210622router-props.png)  
当组件没有直接被 Route 包裹，又需要调用路由的相关方法或获取路由信息时，就需要另作处理

### Hooks

React Router 从 v5.1.0 开始，新增了对 Hooks 的支持，并陆续添加了四个钩子函数

* `useHistory`
* `useLocation`
* `useParams`
* `useRouteMatch`

```jsx
import {useHistory, useLocation, useParams} from 'react-router-dom'

export default function Playground() {
  const router = useHistory()
  // useHistory().location 和 useLocation() 数据结构都是一致的
  const route = useLocation() || router.location
  // 获取 url 中的参数 /playground/:id
  const params = useParams()

  function jump() {
    router.push('...')
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
import { withRouter, RouteComponentProps } from 'react-router-dom'

interface Props extends RouteComponentProps {
  text: string,
  // ...
}

class Temp extends React.Component<Props> {
  constructor (props: Props) {
    super(props)
    console.log(props)
  }

  render () {
    return <div>block a</div>
  }
}

const BlockA = withRouter(Temp)
export default BlockA
```
