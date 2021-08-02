# Vuex 到 Redux 到 Redux Toolkit

因为一些原因，技术栈从 Vue 转到 React，重拾一年没看过的 React 全家桶。

React 有官方支持的中文文档，Router 的概念和 api 比较少，还是比较好懂的。  
以前学 React 的时候，就感受到 Redux 的难度和复杂，而且先接触了 Vuex 再接触 Redux，就会感受到 Redux 配置的复杂~~又别扭~~，中文文档也大多是个人翻译，时间比较久远，没有 Hook 的相关资料，就重新通过英文文档学习一遍。

## 单向数据流

先看两个官方文档 [Redux](https://Redux.js.org/tutorials/essentials/part-1-overview-concepts#state-management) [Vuex](https://next.vuex.vuejs.org/zh/index.html#%E4%BB%80%E4%B9%88%E6%98%AF%E2%80%9C%E7%8A%B6%E6%80%81%E7%AE%A1%E7%90%86%E6%A8%A1%E5%BC%8F%E2%80%9D%EF%BC%9F) 对于单向数据流的描述，可以说是非常相似了，连配图用的都是同一张 😅

![单向数据流](https://s1.huangchengtuo.com/img/210625flow.png)

Redux 和 Vuex 都是为了当多个组件共享状态时，仍能够保持单项的数据流动而设计的状态管理工具。

## 核心概念的比较

### Vuex

Vuex 刚出来的时候，尤大也表示过，Vuex 吸取了 Redux 的很多地方，并进行简化了许多 Redux 的概念和特性。

> Vuex 其实是一个针对 Vue 特化的 Flux，主要是为了配合 Vue 本身的响应式机制。
> 当然吸取了一些 Redux 的特点，比如单状态树和便于测试和热重载的 API，但是也选择性的放弃了一些在 Vue 的场景下并不契合的特性  
> [Vuex 与 Redux 的主要区别在哪里，两者各有什么优缺点？- 尤雨溪](https://www.zhihu.com/question/38546875/answer/76970954)

Vuex 是一个由 Vue 官方维护，Vue 专用的状态管理工具，从 Redux 上吸取了很多东西，并与 Vue 进行了高度的融合。  
Vuex 相较于 Redux，放弃了 action 的概念，并增加了异步修改 state 的方法，命名为 action

- state：单一状态树，模块化的多个模块都储存在同一个 store 实例上
- getter：根据 state 的数据派生出的新的数据，并在依赖的相应数据变化前缓存
- mutation：改变 state 的唯一方法，有多个 mutaion 可使用，只支持同步，并且在 mutation 中直接对原 state 进行更新，由 Vuex 来通知更新
- action：能够异步的调用 mutation，并能在业务层中抛出 promise，继续进行链式的操作

### Redux

Redux 是一个在 js 中通用的状态管理工具，并由 Redux 官方维护一个 react-redux 来实现 React 与 Redux 交互

- state：一个应用中只有一个 store 实例，数据不可变
- action：一个用来描述 state 变化的 event（_其实就是个普通的 js 对象_）
- reducer：改变 state 的唯一方法，且唯一，必须为纯函数，判断 action 对应的字段。Redux 推崇数据不可变，每次 reducer 都是返回一个新的 state

### 简单总结

个人认为 Redux 相较于 Vuex 的难度要高不少的原因，就在于 action 和 reducer 这两个概念，action 作为里一个描述 state 变化的概念，却只是一个 `{type,payload}` 的对象， 真正对 state 进行操作变化的 reducer 却只有一个，需要在同一个 reducer 中根据 action 来进行 switch。。

在异步方面，Vuex 直接由官方提供了 action 这一概念，api 的设计个人认为简洁明了，Redux 则需要通过 `redux-thunk` 等中间件来进行补强。

对于 vuer 来说，Redux 就是只有一个 <ruby>mutation<rt>reducer</rt></ruby> ，往唯一的 <ruby>mutation<rt>reducer</rt></ruby> 里传入 mutation 的 Vuex。

对于 reacter 来说，Vuex 就是有多个 <ruby>reducer<rt>mutation</rt></ruby>，每个 <ruby>reducer<rt>mutation</rt></ruby> 都包含了对应 action 的 Redux， 修改 state 时只需 <ruby>dispatch<rt>commit</rt></ruby> 对应的 <ruby>reducer<rt>mutation</rt></ruby>。

## 建立 store 方式的比较

### Vuex

```js
import { createStore } from 'vuex'

const store = createStore({
  state: {
    count: 1,
    user: null
  },
  mutations: {
    changeCount(state, count) {
      state.count = count
    },
    changeUser(state, user) {
      state.user = user
    }
  },
  actions: {
    login({ commit, state }, form) {
      return api.login(form).then(res => {
        commit('changeUser', res)
        return res
      })
    }
  }
})
```

Vuex 的初始化比较简单，state 存储数据，mutations 同步修改 state，actions 异步 commit 调用 mutation。  
在 mutation 中，state 也是沿袭 Vue 的响应式原理，可以对原 state 进行修改。  
由于在 commit 中是以字符串的形式来调用 mutation，也导致了 Vuex 对于 ts 的不友好。

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
      return { ...state, x: '...' }
    case 'y':
      // ...
      return { ...state, y: '...' }
    case 'z':
      // ...
      return { ...state, z: '...' }
    // ...
  }
}

const store = createStore(reducer, state, middleware)
```

一个最简单的 Redux 实例，通过 createStore 将 reducer 和 state 组合在一起。  
因为 Redux 的数据不可变思想，reducer 作为一个纯函数，需要返回一个全新的 state 对象，对原 state 进行替换。  
关于 Redux 的 action，个人感觉是个非常抽象的概念，按照 Redux 的意思，action 是一个用来告知 reducer 应该如何操作 store 的对象。  
在代码中，action 就是一个 `{ type, payload }` 的对象，在 reducer 对 action 的 type 进行判断，最后对 state 做出相应的修改。  
因为这层 action，可能会让很多人在入门 Redux 的时候难以理解，也可能产生许多与 Redux 思想不同的写法，比如像我一样直接把 `{ type, payload }` 当成 `key: value` 来传值 😅

```js
const reducer = (state, { type, payload }) => {
  return { ...state, [type]: payload }
}
```

## 业务层使用的比较

### Vuex

```vue
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
      this.$store.dispatch('login').then(() => {
        // ...
      })
    }
  }
}
</script>
```

因为 Vue 是将所有的组件、插件挂载到同一个 Vue 实例中，所以所有组件中的 this 指向的都是唯一的一个实例，也因此 Vuex 的使用，就可以直接通过 this 来获取相应的 state，并通过 commit 来调用相应的 mutation 来修改 state。  
因为这个全局的 this，导致了 Vue 在 ts 方面的类型推导非常薄弱

### React Hooks

从 v7.1.0 开始，react-redux 添加了对 Hooks 的支持，通过 `useSelector` 来获取 state 中具体的数据，`useDispatch` 来传递 action，修改 state。

```tsx
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

可以看到 `useSelector` 在 ts 中的类型标记还是略微有些繁琐的，更没有自动的类型推断，需要自己手动标记 state 与 取出的值的类型，可以自己再封装一层 hook，更加愉快的使用 ts。  
另外对于 dispatch 的 ts 类型推断也是几乎没有，后文再讲。

```ts
import { useSelector } from 'react-redux'

export function useMySelector<T = any>(fn: (state: State) => T) {
  return useSelector<State, T>(fn)
}
```

### React HOC

```tsx
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

React 在业务层中的使用，主要是通过 `connect` 包裹或者 `useSelector` 来传递具体的 state 值。修改 state 需要通过往 dispatch 中传入相应的 action，通知 reducer 对 state 做具体的修改。

### 简单总结

Vuex 和 Redux 在业务层的使用，都是简单的获取 state，通过 commit 和 dispatch 通知 store 来对 state 做出相应的修改。

由于 Vuex 是对 Vue 进行特化的状态管理工具，就可以通过全局插件的形式，注入到 Vue 的根实例中，使得 store 能在所有组件的 this 中获取到。

Redux 则是一个单纯的 js 状态管理工具，在 React 中使用就需要 `react-redux` 这一插件，在需要使用状态管理的顶层上包裹一层 `Provider` 标签，再在各个组件中单独引入获取 store 的方法。

## Redux Toolkit

关于状态管理，虽然 Dan Abramov 也发表过 [You Might Not Need Redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367) 这篇文章（_Vuex 文档也引用过_），但鉴于目前校招必学全家桶的环境，状态管理还是十分重要的。但对于初学者和小项目来说，Redux 还是比 Vuex 重了不少。

也许是 Redux 的概念和流程对于大多数人确实是比较复杂，Redux 官方又推出了 [Redux Toolkit](https://redux-toolkit.js.org/) 这个工具，简化了许多 Redux 的操作，将许多 Redux 原来的多步操作封装到了一起。

> The **Redux Toolkit** package is intended to be the standard way to write Redux logic. It was originally created to help address three common concerns about Redux:
>
> - "Configuring a Redux store is too complicated"
> - "I have to add a lot of packages to get Redux to do anything useful"
> - "Redux requires too much boilerplate code"

可以看到 Redux 官方是打算将 Redux Toolkit 这个工具作为 Redux 的最佳实践来进行推广的。  
在 [React Redux](https://react-redux.js.org/) 的官方文档中，所有的教程都是结合 Redux Toolkit 来使用，甚至于在 Redux 的官方文档中，教程也是通过 Redux Toolkit 来进行教学，`createStore`
、`combineReducers`、`applyMiddleware`这些用法，都已经移入 api 参考之中了

### 官方示例

先看 Redux Toolkit 官方的示例，展示了一个最重要的 api

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

可以明显地看到 createSlice 中的 reducers 不仅没有一句 `switch`，并且还直接修改了 state 的值。  
这就是 Redux Toolkit 最明显的一个变化，它移除了 Redux 中原来的 action 概念，将 action 原来的功能与 reducer 进行了合并， 并且可以在 reducer 中对 state 进行直接的修改，由 Redux Toolkit 来转化为数据不可变的操作

### store 的建立

再来看一个详细的 store 的创建

```ts
import { configureStore, createSlice } from '@reduxjs/toolkit'

const state = {
  color: 'red',
  count: 1,
  arr: [] as string[]
}

const slice = createSlice({
  name: 'default',
  initialState: state,
  reducers: {
    changeCount(state, action: { payload: number }) {
      state.count = action.payload
    },
    changeArr(state) {
      state.arr.push('16')
    }
  }
})

export const { changeCount, changeArr } = slice.actions

// configureStore 就可以作为顶层的 Provider 标签中的 store 使用
export default configureStore({
  reducer: slice.reducer,
  // reducer 可以支持多个 slice 进行合并
  // reducer: {
  //   user: userSlice.reducer,
  //   modal: modalSlice.reducer,
  //   theme: themeSlice.reducer,
  //   ...
  // },
  middleware,
  devTools: true
})
```

从 reducer 中的 changeCount 方法中可以看到，action 的概念还没有被完全移除，reducer 仍然需要通过 action 来接收具体的 payload 值，来对 state 进行赋值。（个人感觉完全可以去除这个 action 对象，只留一个 payload 字段）

另外从 `export const { changeCount, changeArr } = slice.actions` 这行代码中也可以看出，action 概念并没有完全移除。

### 异步

Redux Toolkit 中的异步，还是非常繁琐，远没有 Vuex 的异步来的简便。。

### 业务层的使用

在业务层中，仍需要一个用来描述 state 变化的概念，这个概念就是由 `slice.actions` 中导出的与 reducer 同名的 action 方法

```tsx
import { useDispatch, useSelector } from 'react-redux'
import { changeCount } from '@/store'
import type { State } from '@/store'
import { Button } from 'antd'

export default function ReduxA() {
  const count = useSelector(state => state.count)
  const dispatch = useDispatch()

  function add() {
    dispatch(changeCount(count + 1))
    console.log(changeCount(count + 1))
    // 可以直接用 obj 代替
    // dispatch({ type: 'default/changeCount', payload: count + 1 })
  }

  return <>
    <div>count:{count}</div>
    <Button onClick={add}>add</Button>
  </>
}
```

![action](https://s1.huangchengtuo.com/img/210716action.png)

---

![action](https://s1.huangchengtuo.com/img/210716actionlog.png)

通过 ts 的提示和 `console.log(changeCount(count + 1))` 打印出的执行结果可以知道，从 `slice.actions` 导出的就是一个接收 payload，return 对应的 `{ type, payload }` 的方法。`changeCount(count + 1)` 这个方法完全可以替换为 `{ type: 'default/changeCount', payload: count + 1 }`。

可以说在业务层中，action 原来的抽象概念仍然存在，只是具体的表现由原来的对象改为了方法。  
当然 `slice.actions` 这个方法也不是多此一举，它最大的作用就是补强了在 Vuex 和 Redux 中都十分薄弱的跳转功能，极大地提升了在 redux 中排查问题与溯源的便利性。  
在 Vuex 和以前的 Redux 中，业务层的 commit 和 dispatch，都是使用字符串来对具体的操作进行描述，这也就导致了 ide 无法分析并跳转到具体的操作位置，后期维护的时候就得使用最原始的全局搜索来人肉跳转。  
通过使用 `slice.actions` 导出的方法，就能快速地跳转到具体的 reducer，而且在 ts 中 也能够更好的对 payload 的类型进行限制

### Redux Toolkit 与 Vuex 的比较

Redux Toolkit 在创建 store 的层面上，将 action 的概念去除，将原来只存在一个 reducer ，在 reducer 中进行 switch、case 的概念，转化为多个 reducer，并且在 reducer 中允许了可变数据的写法。

在本人看来，这些变化使得 Redux 的最佳实践与 Vuex 十分的相似，相同的 state，reducer 对应 mutation，都采用可变数据的写法，只有细微的 api 命名之间的区别，大大的降低了 Redux 的理解和入门门槛。

对于新人，无需再为 action 和 reducer 中的 switch 而头晕，对于 vuer，在使用了可变数据的写法之后，只需要重新记忆一下新的 api，就能很快无缝切换到 Redux 上。

在具体业务中的使用，Redux 和 Vuex 的区别可以说就是 React 和 Vue 的区别，React 通过 hook 或者 HOC 来获取 state 和修改 state 的 方法，Vue 则通过 this 来获取获取 state 和修改 state 的 方法，Redux Toolkit 并没有过多的改进。最大的变化，就是将原来的 action 对象替换为了方法，极大的提升了跳转至定义的便利性。

尽管通过 Redux Toolkit 的封装，Redux 的用法变得与 Vuex 更加相似，但
