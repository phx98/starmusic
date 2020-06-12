<template>
  <li class="Minesonglist" @click="$emit('translate-song', songdetails.id)" v-if="item">
    <div class="contentleftimg">
      <img src="../assets/add.svg" alt />
    </div>
    <div class="contentleft">
      <h4>{{item.name}}</h4>
      <p>{{item.ar[0].name}}</p>
    </div>
    <div class="collect">
      <img :src="heart" alt @click.stop="switchheart" />
    </div>
    <div class="playing">
      <!-- <img src="../assets/play2.svg" alt /> -->
      <img :src="songplaying" alt />
    </div>
  </li>
</template>

<script>
export default {
  data: function() {
    return {
      songplaying: require("../assets/play2.svg"),
      heart: require("../assets/heart2.svg")
    };
  },
  props: {
    item: Object,
    songid: Number
  },
  computed: {
    songindex: function() {
      return this.songid;
    },
    songdetails: function() {
      return this.item;
    }
  },
  mounted() {
    if (this.songid == this.item.id) {
      this.songplaying = require("../assets/playing.svg");
    }
  },
  watch: {
    songindex: function() {
      if (this.songid == this.item.id) {
        // console.log("我进来了我要变");
        this.songplaying = require("../assets/playing.svg");
      } else {
        this.songplaying = require("../assets/play2.svg");
      }
    }
  },
  methods: {
    switchheart: function() {
      // this.$emit("change-collect",this.songindex);
      if (this.heart == require("../assets/heart2.svg")) {
        this.heart = require("../assets/heart.svg");
      } else {
        this.heart = require("../assets/heart2.svg");
      }
    }
  }
};
</script>

<style lang="less" scoped>
.Minesonglist {
  display: flex;
  padding: 10px 20px;
  border-bottom: 0.5px solid #e0e0e0;
  .contentleftimg {
    flex-basis: 10%;
    img {
      width: 20px;
      margin-top: 12px;
    }
  }
  .contentleft {
    flex-basis: 70%;
    text-align: left;
    // padding-left: 20px;
    box-sizing: border-box;
    h4 {
      font-size: 18px;
      padding-left: 20px;
    }
    p {
      color: #666;
      font-size: 12px;
      margin-top: 5px;
      padding-left: 20px;
    }
  }
  .collect {
    img {
      width: 25px;
      margin-top: 8px;
    }
  }
  .playing {
    margin-left: 20px;
    img {
      margin-top: 4px;
      width: 30px;
    }
  }
}
</style>