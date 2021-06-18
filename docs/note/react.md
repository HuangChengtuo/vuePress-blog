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

## AntD 的 Event TypeScript 类型

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

* `Input.onChange(e: ChangeEvent<HTMLInputElement>)`
* `Radio.Group.onChange(e: RadioChangeEvent)`
* `Checkbox.onChange(e: CheckboxChangeEvent)`
* `Button.onClick(e: React.MouseEvent)`
* `Select.onChange(value: string, option:Option)`


