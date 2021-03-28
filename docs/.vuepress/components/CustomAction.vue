<template>
  <p id="custom-action">
    <a href="https://www.huangchengtuo.com" class="nav-link action-button">回到首页</a>
    <router-link to="/resume" class="nav-link action-button">进入简历 →</router-link>
  </p>
</template>

<script>
export default {
  mounted() {
    // 提前激活腾讯云 serverless
    fetch('https://www.huangchengtuo.com')
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
    margin: 0 1rem 1rem 1rem;
    padding: 0.8rem 1.6rem;
    border-radius: 4px;
    box-sizing: border-box;
    border-bottom: 1px solid #389d70;

    &:hover {
      cursor: pointer;
      background: #4abf8a;
    }
  }
}
</style>
