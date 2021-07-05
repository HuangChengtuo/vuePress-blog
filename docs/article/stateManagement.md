# Redux 与 Vuex 的比较

跳槽新公司，技术栈从 Vue 转到 React，重拾一年没看过的 React 全家桶

React 有官方支持的中文文档，React Router 有印记中文1：1复刻的中文文档（*但还没更新 hook😂*），入门还是比较轻松的  
Redux 就只能找到个人翻译的 gitbook 文档和阮一峰 2016 年的教程。。个人感觉入门要比前面两个高了一个门槛，就花时间自己啃啃生肉，多学习学习

## 单向数据流

先看两个官方文档
[Redux](https://Redux.js.org/tutorials/essentials/part-1-overview-concepts#state-management)
[Vuex](https://next.vuex.vuejs.org/zh/index.html#%E4%BB%80%E4%B9%88%E6%98%AF%E2%80%9C%E7%8A%B6%E6%80%81%E7%AE%A1%E7%90%86%E6%A8%A1%E5%BC%8F%E2%80%9D%EF%BC%9F)
对于单向数据流的描述，可以说是非常相似了  
![单向数据流](https://s1.huangchengtuo.com/img/210625flow.png)  
Redux 和 Vuex 都是为了当多个组件共享状态时，仍能够保持单项的数据流动而设计的

## 核心概念的比较

### Vuex

> Vuex 其实是一个针对 Vue 特化的 Flux，主要是为了配合 Vue 本身的响应式机制。
> 当然吸取了一些 Redux 的特点，比如单状态树和便于测试和热重载的 API，但是也选择性的放弃了一些在 Vue 的场景下并不契合的特性  
> [Vuex与Redux的主要区别在哪里，两者各有什么优缺点？- 尤雨溪](https://www.zhihu.com/question/38546875/answer/76970954)

Vuex 是一个由 Vue 官方维护，Vue 专用的状态管理工具，从 Redux 上吸取了很多东西，并与 Vue 进行了高度的融合  
Vuex 相较于 Redux，放弃了 action 的概念，并增加了异步修改 state 的方法，命名为 action

* state：单一状态树，模块化的多个模块都储存在同一个 store 实例上
* getter：根据 state 的数据派生出的新的数据，并在依赖的相应数据变化前缓存
* mutation：改变 state 的唯一方法，有多个 mutaion 可使用，只支持同步，并且在 mutation 中直接对原 state 进行更新，由 Vuex 来通知更新
* action：能够异步的调用 mutation

### Redux

Redux 是一个在 js 中通用的状态管理工具，并由 Redux 官方维护一个 react-redux 插件来实现 React 与 Redux 交互

* state：一个应用中只有一个 store 实例
* action：一个用来描述 state 变化的 event（*其实就是个普通的 js对象*）
* reducer：改变 state 的唯一方法，且唯一，必须为纯函数，判断 action 对应的字段。Redux 推崇 数据不可变，每次 reducer 都是返回一个新的 state

### 简单总结

对于 vuer 来说，Redux 就是只有一个 <ruby>mutation<rt>reducer</rt></ruby> ，往唯一的 <ruby>mutation<rt>reducer</rt></ruby> 里传入 mutation 的 Vuex

对于 reacter 来说，Vuex 就是有多个 <ruby>reducer<rt>mutation</rt></ruby>，每个 <ruby>reducer<rt>mutation</rt></ruby>
都包含了对应 action 的 Redux， 修改 state 时只需 <ruby>dispatch<rt>commit</rt></ruby> 对应的 <ruby>reducer<rt>mutation</rt></ruby>

## 视图层使用的比较

### Vuex

```vue
<!--Vuex-->
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
      this.$store.dispatch('resetCount').then(() => {
        // ...
      })
    }
  }
}
</script>
```

因为 Vue 是将所有的组件、插件挂载到同一个 Vue 实例中，所以所有组件中的 this 指向的都是唯一的一个实例  
因此 Vuex 的使用，就可以直接通过 this 来获取相应的 state，并通过 commit 来调用相应的 mutation 来修改 state  
也因为这个全局的 this，导致了 Vue 在 ts 方面的类型推导非常薄弱

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
    <h1>Redux A</h1>
    <div>count:{count}</div>
    <Button onClick={add}>add</Button>
  </>
}
```

可以看到 `useSelector` 在 ts 中的类型标记还是略微有些繁琐的，可以自己再封装一层 hook，更加愉快的使用 ts  
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
    <h1>Redux B</h1>
    <div>count:{props.count}</div>
    <Button onClick={minus}>minus</Button>
  </>
}

export default connect((state: State) => {
  return { count: state.count }
})(ReduxB)
```

React 在视图层中的使用，主要是通过 connect 包裹或者 hooks 来传递具体的 state 值  
修改 state 需要通过往 dispatch 中传入相应的 action，通知 reducer 对 state 做具体的修改

### 简单总结

Vuex 和 Redux 在视图层的使用，都是简单的获取 state，通过 commit 和 dispatch 通知 store 做出相应的动作

由于 Vuex 是对 Vue 进行特化的状态管理工具，就可以通过全局插件的形式，注入到 Vue 的根实例中，使得 store 能在所有组件的 this 中获取到

Redux 则是一个单纯的 js 状态管理工具，在 React 中使用就需要`react-redux`这一插件。  
在需要使用状态管理的顶层上包裹一层`Provider`标签，再在各个组件中单独引入获取 store 的方法

## 建立 store 方式的比较

### Vuex

```js
import { createStore } from 'vuex'

const store = createStore({
  state: {
    color: 'red',
    count: 1,
    theme: 'light'
  },
  mutations: {
    changeCount(state, count) {
      state.count = count
    },
    changeTheme(state, theme) {
      state.theme = theme
    }
  },
  actions: {
    changeTheme({ commit, state }, id) {
      api.getTheme(id).then(res => {
        commit('changeTheme', res)
      })
    }
  }
})
```

Vuex 的初始化比较简单，state 存储数据，mutations 同步修改 state，actions 异步 commit mutation  
在 mutation 中，state 也是沿袭 Vue 的响应式原理，可以对原 state 进行修改  
由于在 commit 中是以字符串的形式来调用 mutation，也导致了 Vuex 对于 ts 的天生不好支持。。

### Redux

```js
import { createStore } from 'docs/article/stateManagement'

const state = {
  color: 'red',
  count: 1
}

const reducer = (state: State, { type, payload }) => {
  switch (type) {
    case 'x':
      // ...
      return { ...state, x: payload }
    case 'y':
      // ...
      return { ...state, y: payload }
    case 'z':
      // ...
      return { ...state, z: payload }
    // ...
  }
}

const store = createStore(
  reducer,
  state,
  window.__Redux_DEVTOOLS_EXTENSION__()
)
```

一个最简单的 Redux 实例，通过 createStore 将 reducer 和 state 组合在一起。  
因为 Redux 的数据不可变思想，reducer 作为一个纯函数，需要返回一个全新的 state 对象，对原 state 进行替换。  
关于 Redux 的 action，个人感觉是个有点抽象的概念，按照 Redux 的意思，action 是一个用来告知 reducer 应该如何操作 store 的对象。  
在代码中，action 直接被抽象成一个`{ type, payload }`的对象，在 reducer 对action 的 type 进行判断，最后对 state 做出相应的修改。  
因为这层 action，可能会让很多人在入门 Redux 的时候难以理解，也可能产生许多与 Redux 思想不同的写法  
比如像我一样直接把`{ type, payload }`当成`key: value`来传值 😂

```js
const reducer = (state, { type, payload }) => {
  return { ...state, [type]: payload }
}
```

## Redux toolkit

也许是 Redux 的概念和流程对于大多数人确实是比较复杂，Redux 官方又推出了
[Redux Toolkit](https://redux-toolkit.js.org/) 这个插件，简化了许多 Redux 的操作，将许多 Redux 原来的多步操作封装到了一起。  
在我看来，Redux 官方对于这个插件的推广力度还是挺大的，  
在 [React Redux](https://react-redux.js.org/) 的官方文档中，所有的教程都是结合 Redux Toolkit 来使用的，  
甚至于在 Redux 的官方文档中，教程也是通过 Redux Toolkit 来进行教学，`createStore`、`combineReducers`、`applyMiddleware`这些用法，都归到了 api 参考文档里去了

先看 Redux Toolkit 最重要的一个 api

```js
import { createSlice } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0
  },
  reducers: {
    increment: state => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1
    },
    decrement: state => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    }
  }
})
```

可以看到 createSlice 中的reducers

## 调试插件的比较

### Redux

toolkit 的 configureStore 已经集成

