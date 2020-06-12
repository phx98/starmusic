<template>
  <li class="recommendplay" @click="$emit('translate-song', song.id)">
    <div class="songleft">
      <h3>
        {{song.name}}
        <span>{{song.alia[0] !=undefined? '('+song.alia[0]+')' : ''}}</span>
      </h3>
      <p>
        <span class="sghot"></span>
        <span>{{song.ar[0].name}}</span>
        -
        <span>{{song.al.name}}</span>
      </p>
    </div>
    <div class="songright">
      <!-- <i class="fa fa-play-circle-o"></i> -->
      <img :src="songplaying" alt />
    </div>
  </li>
</template>

<script>
export default {
  data: function() {
    return {
      songplaying: require("../assets/play2.svg")
    };
  },
  props: {
    song: Object,
    songid: Number
  },
  computed: {
    songindex: function() {
      return this.songid;
    }
  },
  mounted() {
    if (this.songid == this.song.id) {
      this.songplaying = require("../assets/playing.svg");
    }
  },
  watch: {
    songindex: function() {
      if (this.songid == this.song.id) {
        // console.log("我进来了我要变");
        this.songplaying = require("../assets/playing.svg");
      } else {
        this.songplaying = require("../assets/play2.svg");
      }
    }
  }
};
</script>

<style lang="less">
.recommendplay {
  display: flex;
  margin-left: 20px;
  border-bottom: #ebebec solid 0.5px;
  .songleft {
    padding: 6px 0px;
    flex-basis: 85%;
    h3 {
      font-size: 17px;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      display: -webkit-box;
      color: #333;
      span {
        color: #888888;
        margin-left: 4px;
      }
    }
    p {
      .sghot {
        display: inline-block;
        width: 12px;
        height: 8px;
        margin-right: 4px;
        background: url(../assets/sq.png);
        background-size: 166px 97px;
        background-position: 0 0;
      }
      font-size: 12px;
      color: #888;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      display: -webkit-box;
    }
  }
  .songright {
    flex-basis: 15%;
    padding-right: 20px;
    text-align: right;
    color: #aaaaaa;
    align-items: center;
    display: flex;
    justify-content: center;
    img {
      width: 25px;
      height: 25px;
      vertical-align: middle;
    }
  }
}
</style>