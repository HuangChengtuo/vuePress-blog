<template>
  <p id="custom-action">
    <a href="https://www.huangchengtuo.com" class="nav-link action-button">回到首页</a>
    <router-link to="/article" class="nav-link action-button">进入文章 →</router-link>
  </p>
</template>

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
    transition: all 0.5s;

    &:hover {
      background: #4abf8a;
    }
  }
}
</style>
