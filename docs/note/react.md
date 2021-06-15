# React

## JSX.Element 与 React.ReactNode 与 React.ReactElement

jsx 就是`React.createElement(type, props, children)`的一个语法糖。
`React.createElement`方法会根据`type`的类型来区分返回普通的`HTMLElement`或者是`React.ReactElement`实例

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
