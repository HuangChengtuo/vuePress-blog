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
        { label: 'Vuex 到 Redux 到 Redux Toolkit', link: 'stateManagement' }
      ]
    }
  }
}
</script>
