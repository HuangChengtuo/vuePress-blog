<template>
  <ul style="margin-top: 3rem">
    <li v-for="item of directory" :key="item.link">
      <router-link :to="item.link">{{ item.label }}</router-link>
    </li>
  </ul>
</template>

<script>
export default {
  data () {
    return {
      directory: [
        { label: '鼠标滚轮翻页效果', link: 'anime' },
        { label: 'Vuex 和 Redux 和 Redux Toolkit 状态管理的区别', link: 'stateManagement' },
        { label: '循环链表在业务中的一次实际应用', link: 'swiper' },
        { label: 'Vue3 Reactivity 响应式原理', link: 'reactivity' },
        { label: 'Vue3.2 script setup 语法', link: 'setup' },
        // { label: 'nginx 301 问题解析', link: 'nginx' }
      ]
    }
  }
}
</script>
