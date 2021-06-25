# Redux

## Redux 与 Vuex 的比较

### 单向数据流

先看两个官方文档
[Redux](https://redux.js.org/tutorials/essentials/part-1-overview-concepts#state-management)
[Vuex](https://next.vuex.vuejs.org/zh/index.html#%E4%BB%80%E4%B9%88%E6%98%AF%E2%80%9C%E7%8A%B6%E6%80%81%E7%AE%A1%E7%90%86%E6%A8%A1%E5%BC%8F%E2%80%9D%EF%BC%9F)  
对于单向数据流的描述，可以说是非常相似了
![单向数据流](https://s1.huangchengtuo.com/img/210625flow.png)  
Redux 和 Vuex 都是为了当多个组件共享状态时，仍能够保持单项的数据流动而设计的

### 核心概念的比较

**Vuex** 的核心概念

* state：单一状态树，模块化的多个模块都储存在同一个 store 实例上
* getter：根据 state 的数据派生出的新的数据，并在依赖的相应数据变化前缓存
* mutation：改变 state 的唯一方法，有多个 mutaion 可使用，只支持同步，并且在 mutation 中直接对原 state 进行更新

* action：能够异步的调用 mutation

**Redux** 的核心概念

* state：一个应用中只有一个 store 实例
* action：一个用来描述 state 变化的 event（*其实就是个普通的 js 对象*）
* reducer：改变 state 的唯一方法，且唯一，必须为纯函数，根据 action 的描述，返回一个新的 state

对于 vuer 来说，redux 就是只有一个 <ruby>mutation<rt>reducer</rt></ruby> ，往 <ruby>mutation<rt>reducer</rt></ruby> 里传入 mutation 的 vuex  
对于 reacter 来说，vuex 就是有多个<ruby>reducer<rt>mutation</rt></ruby>，每个 <ruby>reducer<rt>mutation</rt></ruby> 都包含了各自 action 的 redux
