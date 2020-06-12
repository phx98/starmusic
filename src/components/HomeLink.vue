<template>
  <div :class="{homelink:homelink}" class="homelinktop">
    <div class="top-logo">
      <img src="../assets/musiclogo.svg" />
      <span>星星音乐</span>
      <button>下载APP</button>
    </div>
    <ul id="nav">
      <li>
        <router-link to="/mine">我的音乐</router-link>
      </li>
      <li>
        <router-link to="/Home">推荐音乐</router-link>
      </li>
      <li>
        <router-link to="/hot">热歌榜</router-link>
      </li>
      <li>
        <router-link to="/search">搜索</router-link>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      homelink: false
      // scrollTop:Number,
      // offsetTop:Number
    };
  }
};
</script>
<style lang="less" scoped>
.homelinktop {
  .homelink {
    position: fixed;
    top: 0;
  }
  .top-logo {
    height: 50px;
    background: #42b983;
    padding-top: 20px;
    padding-bottom: 20px;
    box-sizing: content-box;
    color: #bbe6d6;
    span {
      font-size: 23px;
      vertical-align: middle;
    }
    img {
      height: 40px;
      vertical-align: middle;
      margin-left: 20px;
      margin-right: 5px;
    }
    button {
      height: 36px;
      line-height: 36px;
      width: 70px;
      text-align: center;
      font-size: 16px;
      color: #42b983;
      background-color: #fff;
      position: relative;
      float: right;
      margin-right: 50px;
      border: 0px;
      z-index: 3;
      &::before {
        content: "";
        height: 38px;
        width: 36px;
        position: absolute;
        background-color: #fff;
        left: -20px;
        top: 0;
        border-radius: 50%;
        z-index: -1;
      }
      &::after {
        content: "";
        height: 38px;
        width: 36px;
        position: absolute;
        left: 66px;
        top: 0;
        background-color: #fff;
        border-radius: 50%;
        z-index: -1;
      }
    }
  }
}
</style>
