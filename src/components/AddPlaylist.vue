<template>
  <div class="addplaylist">
    <div class="add">
      <h4>新建歌单</h4>
      <input type="text" v-model="newplaylist" placeholder="请输入歌单标题" class="playlisttext" />
      <div class="ifprivacy">
        <label for="ifprivacy">
          <input type="checkbox" v-model="ifprivacy" id="ifprivacy" />
          <img :src="privacyimg" alt />
          <span>设置为隐私歌单</span>
        </label>
      </div>
      <div class="btn">
        <span @click="$emit('cancel-add')">取消</span>
        <span @click="$emit('submit-newplaylist',newplaylist)">提交</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      newplaylist: "",
      privacyimg: require("../assets/privacyfalse.svg"),
      ifprivacy: false
    };
  },
  watch: {
    ifprivacy: function(val) {
      if (val) {
        this.privacyimg = require("../assets/privacytrue.svg");
      } else {
        this.privacyimg = require("../assets/privacyfalse.svg");
      }
    }
  }
};
</script>

<style lang="less" scoped>
.addplaylist {
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10000;
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  text-align: center;
  .add {
    width: 90%;
    background: #fff;
    position: absolute;
    top: 40%;
    left: 5%;
    border-radius: 20px;
    padding: 20px 20px;
    box-sizing: border-box;
    h4 {
      font-weight: 500;
      font-size: 20px;
    }
    input.playlisttext {
      border: none;
      outline: none;
      border-bottom: 1px solid #e0e0e0;
      font-size: 16px;
      width: 90%;
      margin: 10px 0px;
      padding: 10px 5px;
    }
    .ifprivacy {
      text-align: left;
      padding-left: 10px;
      font-size: 14px;
      input {
        opacity: 0;
      }
      img {
        width: 18px;
        vertical-align: bottom;
      }
      span {
      }
    }
    .btn {
      color: #42b983;
      text-align: right;
      margin: 0px 20px;
      margin-top: 10px;
      span {
        margin-left: 50px;
        font-family: "宋体";
        font-size: 18px;
      }
    }
  }
}
</style>