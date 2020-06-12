<template>
  <div class="likecount">
    <span>{{likecount}}</span>
    <!-- <i class="fa fa-thumbs-o-up"></i> -->
    <img :src="zanaddress" @click="addcount" />
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      redhand: false,
      zanaddress: require("@/assets/zan1.svg"),
      likecount: this.commentlikecount
    };
  },
  props: ["commentlikecount"],
  methods: {
    addcount: function() {
      this.redhand = !this.redhand;
      if (this.redhand) {
        this.likecount++;
        this.zanaddress = require("@/assets/zan2.svg");
      } else {
        this.likecount--;
        this.zanaddress = require("@/assets/zan1.svg");
      }
    }
  }
};
</script>
<style lang="less" scoped>
.likecount {
  img {
    width: 14px;
    height: 14px;
    vertical-align: middle;
  }
  span {
    font-size: 11px;
    line-height: 22px;
    margin-right: 6px;
    color: #999;
  }
}
</style>
