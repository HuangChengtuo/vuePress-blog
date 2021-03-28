<template>
  <div class="qrcode-container">
    <img src="https://s1.huangchengtuo.com/img/壁虎看看快手版小程序码.jpg" alt="壁虎看看快手版" class="qrcode">
    <img src="https://s1.huangchengtuo.com/img/挂榜小程序码.jpg" alt="挂榜小程序" class="qrcode">
  </div>
</template>

<script>
export default {
  mounted() {
    // 提前激活腾讯云 serverless
    fetch('https://www.huangchengtuo.com')
  }
}
</script>

<style scoped>
.qrcode {
  width: 8rem;
  height: 8rem;
}

.qrcode + .qrcode {
  margin-left: 2rem;
}
</style>