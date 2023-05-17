# Vue3 script setup 语法

Vue3.2 已经发布有两年了，Vue3.0 更是已经发布三年了，配合着 Vite 的超快速度，吸引了一大波的热度。  
随着最近 Nuxt3.0 的发布，以及 Vue 文档的全新改版，setup 语法组合式（composition）的地位已经正式盖过老 Vue2 的选项式（options）风格。

![api风格](https://s1.huangchengtuo.com/img/230427codeStyle.png)

## 3.2 以前的 setup

现在的 Vue，已经发展出和 React 类似的两套写法风格。  
Vue2 的 options 对应了 React16.8 以下的 class，Vue3 的 composition 对应了 React16.8 的 function hooks。

composition 风格，作为 Vue3 的最重磅功能，在刚发布时却是以一种别扭的方法，缝合入进原先的 options 写法里，着实让人不习惯。

```vue
<script>
export default {
  data () {
    return {
      date: new Date()
    }
  },
  setup () {
    const count = ref(0)

    function getData () {
      fetch('...').then()
    }

    onMounted(() => { console.log('mounted') })
    // 返回值会暴露给模板和其他的选项式 API 钩子
    return { count, getData }
  },
  mounted () {
    console.log(this.count) // 0
    this.getData()
  }
}
</script>
```

对比 React 的话，就像是把 hooks 塞进了 class 里。。

```jsx
class Component extends React.Component {
  state = {
    date: new Date()
  }

  functional () {
    const [count, setCount] = useState(0)

    function getData () {
      fetch('...').then()
    }

    useEffect(() => { console.log('mounted') }, [])
    return { count, getData }
  }

  componentDidMounted () {
    console.log(this.state.count)
    this.getData()
  }
}
```

## Vue3.2 发布的 script setup

直到 Vue3.2，单文件组件更新了 script setup 的语法，使得 options 和 composition 能彻底分离。

```vue
<template>
  <button @click="count++">{{ count }}</button>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, reactive, onMounted, watch } from 'vue'

const props = defineProps<{ id: number, visible: boolean }>()
const emit = defineEmits<{
  (e: 'change', id: number): void,
  (e: 'onClose', visible: boolean): void
}>()

const count = ref(0)
const state = reactive({ count: 0, date: new Date() })

onMounted(() => { console.log('mounted') })

watch(count, (newValue, oldValue) => {})
</script>
```

## 与 Vue3.1 以及 Vue2 的对比

### import

在 Vue3.2 之前，所有 import 进来的东西，仍然需要在 options 中注册后，才能在 html 中获取到，在 Vue3.2 的 script setup 的代码块中，所有顶层的 import 都会自动暴露给模版。
```vue

<template>
  <div>{{ formatDate(data) }}</div>
  <CustomComponent />
</template>

// Vue2 & Vue3.1
<script>
import { formatDate } from '@/utils'
import CustomComponent from '...'

export default {
  components: { CustomComponent },
  setup () {
    // Vue3.1
    return { formatDate }
  },
  // Vue2
  methods: {
    formatDate,
    fn () {}
  }
}
</script>

// Vue3.2
<script setup>
import { formatDate } from '@/utils'
import CustomComponent from '...'
</script>
```

### 钩子

Vue3 将原先声明式的生命周期改为了钩子函数，做到了逻辑点分离，能够在相对零散的各个逻辑附近多次调用声明周期

```vue
// Vue2
<script>
export default {
  data () {
    return {
      tableData: [],
      page: 1,
      loading: false,
      animeDom: null,
      animeConfig: {}
    }
  },
  mounted () {
    this.getTableData()
    this.startAnime()
  },
  watch: {
    animeConfig () {},
    page () {}
  },
  unmounted () {
    this.stopAnime()
  },
  methods: {
    // 若干行
    getTableData () {},
    // 若干行
    startAnime () {},
    stopAnime () {}
  }
}
</script>

// Vue3
<script setup>
import { ref } from 'vue'

const tableData = ref([])
const loading = ref([])
onMounted(() => {
  // getTableData logic
})
// 若干行
const animeDom = ref(null)
const animeConfig = ref({})
onMounted(() => {
  // startAnime logic
})
onUnmounted(() => {
  // stopAnime logic
})

watch(animeConfig,()=>{
  // restart
})

</script>
```

## 与 React 的对比

和 React 的 function hooks 写法对比一下，可以发现很多的相似之处，除了 Vue 三分离和 React 的 jsx 这一大区别，在很多方面都可以看到这两种写法的大大小小的异同。

### props

React 的 props，只需要简单的定义函数的入参即可，非常方便，ts 的定义也是十分的清晰，属性和方法也不需要区分，直接从 props 中取出即可，不过方法的定义，只能通过人为的约定 on 来区分。  
Vue 则是需要区分属性和方法，也可以通过范型来标注 ts 类型；方法的定义，Vue 通过 @ 来进行强制的约定，但对于方法的 ts 定义，没有 React 的清新明了，需要进行一层转换。  
通过使用 script setup，Vue 能够与 React 一样在 ide 对组件缺少的 props 进行提示。

```html
<!-- Vue -->
<Component :count="count" @change="fn" />

<!-- React -->
<Component count={count} onChange={fn} />
```

```ts
// Vue
const props = defineProps<{ count: number }>()
const emit = defineEmits<{
  (e: 'change', value: number): void
}>()

// React
interface Props {
  count: number,
  onChange (count: number): void
}

function Component (props: Props) {
  // ...
}
```

### 响应式数据

生成响应式数据方面，React 通过 useState 来进行声明，Vue 则可以通过 ref 和 reactive 来声明基本类型和对象。  
修改数据方面，则是 Immutable 和 mutable 的区别，React 通过是 setState 传参来修改数据，Vue 则是可以直接修改原值。

```js
// Vue
const count = ref(0)
const state = reactive({ count: 0 })
count.value++
state.count++
console.log(count.value, state.count)

// React
const [count, setCount] = useState(0)
setCount(count + 1)
console.log(count) // old 🤔️
```

React 的响应式数据，都是通过 useState 来声明，setState 来更新数据，不仅页面的响应式更新是异步的，响应式数据的修改也是异步的，如果需要立刻使用，官网给出的[解决方案](https://react.dev/reference/react/useState#ive-updated-the-state-but-logging-gives-me-the-old-value)是自己提前缓存需要使用的变量。
> This is because states behaves like a snapshot. Updating state requests another render with the new state value, but does not affect the count JavaScript variable in your already-running event handler.  
> If you need to use the next state, you can save it in a variable before passing it to the set function:

```js
const nextCount = count ++;
setCount(nextCount);

console.log(count);     // 0
console.log(nextCount); // 1
```

Vue 对于基本类型的响应式数据，需要通过 ref 来进行声明，通过 `.value` 来更新数据，复杂类型就可以直接使用 reactive 来进行声明。  
因为 Vue 是数据可变的原理，通过 Proxy 来代理数据的读写，所以可以做到直接更新数据，实时的获取最新值，代理中触发的响应式更新则可以暂存，异步的与多个响应式更新一起执行，减少渲染次数以节省性能。

### 生命周期和副作用函数

React 将 mounted、watch、unmount 这些生命周期全部整合进了 useEffect，Vue 则区分了这几个函数。  
其他的副作用函数 Vue 和 React 大多都有提供，只有命名上的一些区别。

```js
// Vue
onMounted(() => {})
onUnmounted(() => {})
watch(count, (newValue, oldValue) => {})

const n = computed(() => {return '...'})

// React
useEffect(() => {
  // ...
  return () => {}
}, [])
useMemo(() => {}, [])
```

## 总结

从一开始的 options 和 class，Vue 和 React 就有相同的 this，到 setup 和 function hooks ，Vue 和 React 又有了相同概念的 hooks。  
对于已经学会一种框架的人，熟悉另一个的难度变得越来越低。  
对于新人在 Vue 和 React 的选择上，js 写法上的差异已经变得越来越不重要，更多的是

* 三剑客分离和 jsx all in one 的区别
* 响应式数据直接修改，由代理拦截自动追踪进行响应式更新，响应式数据不可修改，手动通知进行响应式更新
* 周边生态，全家桶的选择

如果对 Vue3 感兴趣或者使用过 Vue2 的话，欢迎各位去尝试新的 setup 语法。
