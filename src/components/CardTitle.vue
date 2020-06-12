<template>
  <div class="cardtitle">
    <h3>
      <slot></slot>
    </h3>
  </div>
</template>

<style lang="less" scoped>
@red: #42b983;
.cardtitle {
  h3 {
    border-left: 2px solid @red;
    font-size: 16px;
    line-height: 16px;
    padding-left: 15px;
    margin: 15px 0;
  }
}
</style>