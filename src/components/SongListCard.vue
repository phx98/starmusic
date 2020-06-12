<template>
  <li class="card" @click="ToPlaylist(item.id,count)">
    <div class="thumb">
      <img :src="item.picUrl" />
      <span>
        <img src="../assets/headset.svg" alt />
        {{playlistcount()}}
      </span>
    </div>
    <h5>{{item.name}}</h5>
  </li>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {
        return {
          id: 4969079749,
          type: 0,
          name: "欧美 | 欢快小调拯救你的不开心",
          copywriter: "编辑推荐：音乐是治愈人心的良药",
          picUrl:
            "https://p2.music.126.net/nflx5ZxSSPivvGnyS5WRGw==/109951164906376339.jpg",
          canDislike: false,
          trackNumberUpdateTime: 1586934907095,
          playCount: 1209355,
          trackCount: 100,
          highQuality: false,
          alg: "featured"
        };
      }
    }
  },
  data: function() {
    return {
      count: Number
    };
  },
  methods: {
    ToPlaylist: function(id, playcount) {
      // console.log(id);
      // 编程式路径
      this.$router.push({
        path: "playlist",
        query: {
          id: id,
          audiencecount: playcount
        }
      });
    },
    playlistcount: function() {
      if (this.item.playCount / 100000000 > 1) {
        this.count = (this.item.playCount / 100000000).toFixed(1) + "亿";
        return this.count;
      } else if (this.item.playCount / 10000 > 1) {
        this.count = (this.item.playCount / 10000).toFixed(1) + "万";
        return this.count;
      } else {
        this.count = this.item.playCount;
        return this.count;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.card {
  flex-basis: 30%;
  flex-grow: 1;
  margin-bottom: 5px;
  list-style: none;
  &:nth-child(3n + 2) {
    margin: 0 3px;
  }
  .thumb {
    position: relative;
    img {
      vertical-align: middle;
      width: 100%;
    }
    span {
      position: absolute;
      top: 2px;
      right: 5px;
      color: white;
      padding-left: 13px;
      font-size: 12px;
      text-shadow: 1px 0 0 rgba(0, 0, 0, 0.15);
      img {
        width: 12px;
        height: 12px;
        vertical-align: middle;
        margin-bottom: 3px;
      }
    }
  }
  h5 {
    font-size: 13px;
    margin: 3px 0 5px 0;
    line-height: 1.2em;
    overflow: hidden;
    padding: 6px 2px 0px 6px;
    overflow: hidden;
    min-height: 30px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    color: #333;
  }
}
</style>
