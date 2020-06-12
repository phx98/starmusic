<template>
  <div class="mineplaylist">
    <header>
      <img src="../assets/return1.svg" @click="Toprevious" />
      <div class="songdetailtop">
        <h4>歌单</h4>
      </div>
      <div class="share">
        <img src="../assets/search3.svg" alt />
        <img src="../assets/dueto.svg" alt />
      </div>
    </header>
    <div class="mineplaylisttitle">
      <div class="titlemask" :style="{backgroundImage: `url(${mineplaylist.coverImgUrl})`}">
        <!-- <img :src="playlistcreator.backgroundUrl" alt /> -->
      </div>
      <div class="imgleft">
        <img :src="mineplaylist.coverImgUrl" alt />
      </div>
      <div class="playlistitleright">
        <h2>{{mineplaylist.name}}</h2>
        <div v-if="playlistcreator">
          <img :src="playlistcreator.avatarUrl" alt />
          <span>{{playlistcreator.nickname}}</span>
        </div>
      </div>
    </div>
    <div class="playlistcontent">
      <div class="contenttitle">
        <img src="../assets/play2.svg" alt />
        <span class="contenttitleone">播放全部</span>
        <span class="contentnum">(共{{mineplaylist.trackCount}}首)</span>
      </div>
      <lazy-component>
        <RecommendPlay
          :songid="songid"
          v-for="(item,index) in mineplaylistSong"
          :key="index"
          :song="item"
          @translate-song="$emit('translate-song',$event)"
        ></RecommendPlay>
      </lazy-component>
    </div>
  </div>
</template>

<script>
import RecommendPlay from "@/components/RecommendPlay.vue";
export default {
  components: {
    RecommendPlay
  },
  props: {
    songid: Number
  },
  data: function() {
    return {
      mineplaylist: Object,
      mineplaylistSong: Object,
      songids: "",
      id: this.$route.query.playlistid
    };
  },
  methods: {
    //   获取自己的歌单信息
    getmineplaylist: function() {
      this.axios
        .get("/playlist/detail", {
          params: {
            id: this.id
          }
        })
        .then(res => {
          //   console.log(res);
          this.mineplaylist = res.data.playlist;
          window.localStorage.setItem(
            "mineplaylist-" + this.id,
            JSON.stringify({
              val: res.data.playlist
            })
          );
          // 获取ids
          this.getplaylistsongids();
        })
        .catch(error => {
          console.log(this.id);
          console.log(error, "访问失败");
        });
    },
    // 检查是否已经存在本地
    checklocalmineplay: function() {
      let checkplaylist = JSON.parse(
        window.localStorage.getItem("mineplaylist-" + this.id)
      );
      if (checkplaylist) {
        this.mineplaylist = checkplaylist.val;
        // 获取ids
        this.getplaylistsongids();
      } else {
        this.getmineplaylist();
      }
    },
    Toprevious: function() {
      this.$router.back();
    },
    // 获取歌单里面的歌曲详情
    getPlaylistSong: function() {
      this.$axios
        .get("/song/detail?ids=" + this.songids)
        .then(res => {
          // console.log(res.data.songs[100]);
          this.mineplaylistSong = res.data.songs;
          window.localStorage.setItem(
            "playlistSong" + this.id,
            JSON.stringify({
              val: res.data.songs
            })
          );
        })
        .catch(error => {
          console.log("访问失败", error);
        });
    },
    // 检查是否本地是否存在歌单里面的歌曲详情
    checkPlaylistSong: function() {
      let checkplaylistsong = JSON.parse(
        window.localStorage.getItem("playlistSong" + this.id)
      );
      if (checkplaylistsong) {
        // console.log("里面已经有了");
        this.mineplaylistsong = checkplaylistsong.val;
      } else {
        this.getPlaylistSong();
      }
    },
    getplaylistsongids: function() {
      let arr = [];
      this.trackIds.map(item => {
        arr.push(item.id);
      });
      this.songids = arr.join(",");
    }
  },
  created() {
    //检查是否有本地mineplay
    this.checklocalmineplay();
    // 获取歌单歌曲信息
    this.getPlaylistSong();
  },
  computed: {
    playlistcreator: function() {
      return this.mineplaylist.creator;
    },
    trackIds: function() {
      return this.mineplaylist.trackIds;
    }
  },
  watch: {
    id: function() {
      this.checklocalmineplay();
      this.getPlaylistSong();
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.id = to.query.playlistid;
    next();
  }
};
</script>

<style lang="less" scoped>
.mineplaylist {
  // background: rgba(0, 0, 0, 0.5);
  header {
    height: 50px;
    line-height: 50px;
    background: rgba(0, 0, 0, 0);
    position: relative;
    img {
      height: 20px;
      width: 20px;
      margin-left: 10px;
      vertical-align: middle;
    }
    div.songdetailtop {
      display: inline-block;
      // background: skyblue;
      vertical-align: middle;
      line-height: 22px;
      margin-left: 15px;
      width: 60%;
      h4 {
        font-size: 20px;
        color: #fff;
        margin: 0px;
        padding: 0px;
        line-height: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        display: -webkit-box;
        // background: pink;
      }
    }
    div.share {
      float: right;
      margin-right: 10px;
      margin-top: 0px;
      img {
        height: 25px;
        width: 25px;
        margin-left: 10px;
      }
    }
  }
  .mineplaylisttitle {
    height: 200px;
    background-size: 100% 100%;
    background-position: center;
    overflow: hidden;
    display: flex;
    .titlemask {
      position: absolute;
      top: -50px;
      left: 0;
      height: 300px;
      width: 100%;
      z-index: -1;
      filter: blur(15px) brightness(0.8);
      background-size: 300%;
      background-position: center;
      background-repeat: no-repeat;
      // overflow: hidden;
    }
    .imgleft {
      // width: 30%;
      margin: 20px 20px;
      border-radius: 2px;
      height: 120px;
      border-radius: 5px;
      overflow: hidden;
      img {
        height: 100%;
        filter: brightness(0.9);
      }
    }
    .playlistitleright {
      img {
        width: 30px;
        border-radius: 50%;
        vertical-align: middle;
        margin-right: 5px;
      }
      color: #fff;
      h2 {
        font-size: 20px;
        margin: 20px 0px;
      }
    }
  }
  .playlistcontent {
    .contenttitle {
      padding: 15px;
      // background: #ccc;
      background: #fff;
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
      img {
        width: 28px;
        vertical-align: middle;
        margin-right: 5px;
      }
      .contenttitleone {
        font-size: 18px;
        position: relative;
        top: 1px;
      }
      .contentnum {
        font-size: 12px;
        color: #666;
        margin-left: 5px;
      }
    }
  }
}
</style>