# Redux 与 Vuex 的比较

## 单向数据流

先看两个官方文档
[Redux](https://redux.js.org/tutorials/essentials/part-1-overview-concepts#state-management)
[Vuex](https://next.vuex.vuejs.org/zh/index.html#%E4%BB%80%E4%B9%88%E6%98%AF%E2%80%9C%E7%8A%B6%E6%80%81%E7%AE%A1%E7%90%86%E6%A8%A1%E5%BC%8F%E2%80%9D%EF%BC%9F)
对于单向数据流的描述，可以说是非常相似了  
![单向数据流](https://s1.huangchengtuo.com/img/210625flow.png)  
Redux 和 Vuex 都是为了当多个组件共享状态时，仍能够保持单项的数据流动而设计的

## 核心概念的比较

### Vuex

> Vuex 其实是一个针对 Vue 特化的 Flux，主要是为了配合 Vue 本身的响应式机制。
> 当然吸取了一些 Redux 的特点，比如单状态树和便于测试和热重载的 API，但是也选择性的放弃了一些在 Vue 的场景下并不契合的特性  
> [Vuex与Redux的主要区别在哪里，两者各有什么优缺点？- 尤雨溪](https://www.zhihu.com/question/38546875/answer/76970954)

* state：单一状态树，模块化的多个模块都储存在同一个 store 实例上
* getter：根据 state 的数据派生出的新的数据，并在依赖的相应数据变化前缓存
* mutation：改变 state 的唯一方法，有多个 mutaion 可使用，只支持同步，并且在 mutation 中直接对原 state 进行更新
* action：能够异步的调用 mutation

vuex 是一个由 vue 官方维护，vue 专用的状态管理工具，从 redux 上吸取了很多东西，并与 vue 进行了高度的融合

### Redux

* state：一个应用中只有一个 store 实例
* action：一个用来描述 state 变化的 event（*其实就是个普通的 js对象*）
* reducer：改变 state 的唯一方法，且唯一，必须为纯函数，判断 action 对应的字段，返回一个新的 state

redux 是一个在 js 中通用的状态管理工具，由 redux 官方维护一个 react-redux 插件来实现 react 与 redux 交互

### 简单总结

对于 vuer 来说，redux 就是只有一个 <ruby>mutation<rt>reducer</rt></ruby> ，往唯一的 <ruby>mutation<rt>reducer</rt></ruby> 里传入 mutation 的 vuex

对于 reacter 来说，vuex 就是有多个 <ruby>reducer<rt>mutation</rt></ruby>，每个 <ruby>reducer<rt>mutation</rt></ruby>
都包含了对应 action 的 redux， 变化时只需调用对应的 <ruby>reducer<rt>mutation</rt></ruby>

## 视图层使用的比较

### Vuex

```vue
<!--vuex-->
<template>
  <h1>{{ $store.state.count }}</h1>
</template>

<script>
export default {
  methods: {
    add() {
      this.$store.commit('changeCount', this.$store.state.count + 666)
    },
    reset() {
      this.$store.dispatch('resetCount').then(res => {
        // ...
      })
    }
  }
}
</script>
```

因为 vue 是将所有的组件、插件挂载到同一个 vue 实例中，所以所有组件中的 this 指向的都是唯一的一个实例  
因此 vuex 的使用，就可以直接通过 this 来获取相应的 state，并通过 commit 来调用相应的 mutation 来修改 state  
也因为这个全局的 this，导致了 vue 在 ts 方面的类型推导非常薄弱

### React Hooks

从 v7.1.0 开始，react-redux 添加了对 Hooks 的支持

```tsx
// a.tsx
import { useSelector, useDispatch } from 'react-redux'
import type { State } from '@/store'
import { Button } from 'antd'

export default function ReduxA () {
  const count = useSelector<State, number>(state => state.count)

  const dispatch = useDispatch()

  function add () {
    dispatch({ type: 'count', payload: count + 1 })
  }

  return <>
    <h1>redux A</h1>
    <div>count:{count}</div>
    <Button onClick={add}>add</Button>
  </>
}
```

可以看到 `useSelector` 在 ts 中的标记还是略微有些繁琐的，可以自己再封装一层 hook，更加愉快的使用 ts  
另外对于 dispatch 的 ts 类型推断也是几乎没有，后文再讲

```ts
// store.ts
import { useSelector } from 'react-redux'

export function useMySelector<T = any> (fn: (state: State) => T) {
  return useSelector<State, T>(fn)
}
```

### React HOC

```tsx
// b.tsx
import { Button } from 'antd'
import { connect, DispatchProp } from 'react-redux'
import type { State } from '@/store'

function ReduxB (props: { count: number } & DispatchProp) {
  function minus () {
    props.dispatch({ type: 'count', payload: props.count - 1 })
  }

  return <>
    <h1>redux B</h1>
    <div>count:{props.count}</div>
    <Button onClick={minus}>minus</Button>
  </>
}

export default connect((state: State) => {
  return { count: state.count }
})(ReduxB)
```
