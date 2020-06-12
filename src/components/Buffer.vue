<template>
  <div class="buffer">
    <div>
      <p>
          <slot></slot>
      </p>
      <span></span>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.buffer {
  position: fixed;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  width: 100%;
  top: 0px;
  z-index: 10000;
  left: 0px;
  div {
    width: 100%;
    text-align: center;
    position: fixed;
    top: 45%;
    span {
      display: inline-block;
      background: #bbe6d6;
      height: 5px;
      animation: loading 2s;
      width: 200px;
      position: absolute;
      left: calc(50% - 100px);
      box-sizing: border-box;
    }
    p {
      color: #fff;
      font-size: 14px;
      margin-bottom: 10px;
    }
    @keyframes loading {
      from {
        width: 0px;
      }
      to {
        width: 200px;
      }
    }
  }
}
</style>