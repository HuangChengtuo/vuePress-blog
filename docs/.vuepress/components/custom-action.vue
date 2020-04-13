<template>
  <p id="custom-action">
    <a class="nav-link action-button" @click="jump('note/basic')">进入笔记</a>
    <a class="nav-link action-button" @click="jump('CV')">我的简历 →</a>
  </p>
</template>

<script>
export default {
  methods: {
    jump(text) {
      this.$router.push({ path: `/${text}.html` })
    }
  }
}
</script>

<style lang="stylus">
#custom-action {
  margin: 1.8rem auto;
  text-align: center;

  .action-button {
    display: inline-block;
    font-size: 1.2rem;
    color: white;
    background: #3eaf7c;
    margin 0 1rem 1rem 1rem
    padding: 0.8rem 1.6rem;
    border-radius: 4px;
    box-sizing: border-box;
    border-bottom: 1px solid #389d70;

    &:hover {
      cursor pointer
      background: #4abf8a;
    }
  }
}
</style>
