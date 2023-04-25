# Vue3 script setup 语法

## 风格对比

Vue 3.2 已经发布有两年了，Vue3.0 更是已经发布三年了，现在的 Vue，已经发展出和 React 类似的两套写法风格。  
Vue2 的 options 和 Vue3 的 composition，对应了 React16.8- 的 class 和 React16.8+ 的 function hooks。

composition 风格，作为 Vue3 的最重磅功能，在刚发布时却是以一种缝合怪的风格，嵌入进原先的 options 写法里，着实让人不习惯，在一开始的风评也没有现在这样。

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

## script setup

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

## 对比

和 React 的 function hooks 写法对比一下，可以发现很多的相似之处，除了 Vue 三分离和 React 的 jsx 这一大区别，在 js 部分，可以看到两者有很多的相同之处。

### props

React 的 props，只需要简单的定义函数的入参即可，非常方便，Vue 则是需要区分对象和方法。  
通过使用 script setup，Vue 能够与 React 一样在 ide 上直接组件使用处标记缺少的 props 属性与提示。

```ts
// Vue
const props = defineProps<{ visible: boolean }>()
const emit = defineEmits<{
  (e: 'onClose', needRefresh: boolean): void
}>()

// React
function Component (props: {
  visible: boolean,
  onClose (needRefresh: boolean): void
}) {}
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
setCount(count++)
console.log(count) // old 🤔️
```

### 生命周期和副作用函数

React 将 mounted、watch、unmount 等功能全部整合进了 useEffect，Vue 则区分了这几个函数。

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
对于新人在 Vue 和 React 的选择上，写法的差异已经变得越来越不重要，更多的是

* 三剑客分离和 jsx all in one 的区别
* 响应式数据直接修改，由代理拦截自动追踪进行响应式更新，响应式数据不可修改，手动通知进行响应式更新
* 周边生态，全家桶的选择