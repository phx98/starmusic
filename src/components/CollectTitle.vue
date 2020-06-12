<template>
  <div class="collecttitle">
    <h4>
      <slot></slot>
    </h4>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.collecttitle {

  h4 {
    font-size: 20px;
    font-weight: 500;
    text-align: left;
    background: #fff;
    padding: 5px 20px;
  }
}
</style>