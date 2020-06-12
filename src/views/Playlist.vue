<template>
  <div class="homeplaylist">
    <div class="playlistmask" v-if="checkenter">
      <img src="../assets/load.gif" alt />
    </div>
    <template v-if="songdata && playdata">
      <div class="header">
        <div class="mask" :style="{backgroundImage: `url(${songdata.coverImgUrl})`}"></div>
        <div class="titleimg">
          <img :src="songdata.coverImgUrl" />
          <span class="headercount">
            <!-- <i class="fa fa-headphones"></i> -->
            <img src="../assets/headset.svg" alt />
            {{audiencecount}}
          </span>
          <span class="playlisttitle">歌单</span>
        </div>
        <div class="header-right">
          <h4>{{songdata.name}}</h4>
          <div class="header-rtoop">
            <img :src="creator.avatarUrl" alt />
            <span>{{creator.nickname}}</span>
          </div>
        </div>
      </div>

      <div class="labelcontent">
        <h5>
          标签:
          <span v-for="(playlabel,index) in songdata.tags" :key="index">{{playlabel}}</span>
        </h5>
        <div class="labeldescrip" :class="{show:showhidden}">
          <span>简介:</span>
          <span>{{songdata.description}}</span>
        </div>
        <div class="more" @click="showhidden=!showhidden" v-if="checkover">
          <i class="fa fa-angle-up" v-if="showhidden"></i>
          <i v-else class="fa fa-angle-down"></i>
        </div>
      </div>
      <div class="content">
        <h5 class="contentitle">歌曲列表</h5>
        <ul class="contentdetails">
          <li
            v-for="(songlist,index) in songdata.tracks"
            :key="index"
            @click="$emit('translate-song',songlist.id)"
          >
            <span class="songorder">{{index+1}}</span>
            <div class="songlistfl">
              <h3>{{songlist.name}}</h3>
              <p>
                <span>{{songlist.ar[0].name}}</span>
                -
                <span>{{songlist.al.name}}</span>
              </p>
            </div>
            <div class="songlistright">
              <img src="../assets/play2.svg" alt />
            </div>
          </li>
        </ul>
        <h5 class="contentitle">精彩评论</h5>
        <ul>
          <li v-for="(hotcomment,index) in hotcomments" :key="index" class="contenthotcomments">
            <div class="conhotc-top">
              <div class="conhotc-top-left">
                <img :src="hotcomment.user.avatarUrl" />
              </div>
              <div class="talkman">
                <h5>{{hotcomment.user.nickname}}</h5>
                <p>{{counttime(hotcomment.time)}}</p>
              </div>
              <LikeCount :commentlikecount="hotcomment.likedCount" class="likecount"></LikeCount>
            </div>
            <div class="conhotc-bottom">
              <p>{{hotcomment.content}}</p>
            </div>
          </li>
        </ul>

        <h5 class="contentitle">最新评论({{comments.length}})</h5>
        <ul>
          <li v-for="(comment,index) in comments" :key="index" class="contentcomments">
            <div class="conhotc-top">
              <div class="conhotc-top-left">
                <img :src="comment.user.avatarUrl" />
              </div>
              <div class="talkman">
                <h5>{{comment.user.nickname}}</h5>
                <p>{{counttime(comment.time)}}</p>
              </div>
              <LikeCount :commentlikecount="comment.likedCount" class="likecount"></LikeCount>
            </div>
            <p class="conhotc-bottom">{{comment.content}}</p>
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>
<script>
import LikeCount from "@/components/LikeCount.vue";

export default {
  data: function() {
    return {
      songListId: this.$route.query.id,
      songdata: null,
      showhidden: false,
      playdata: null,
      audiencecount: this.$route.query.audiencecount,
      checkenter: true
    };
  },
  components: {
    LikeCount
  },
  computed: {
    creator: function() {
      return this.songdata.creator;
    },
    comments: function() {
      return this.playdata.comments;
    },
    hotcomments: function() {
      return this.playdata.hotComments;
    },
    checkover: function() {
      return this.songdata.description.length > 30 ? true : false;
    }
  },
  methods: {
    getSonglist: function() {
      this.axios
        .get("/playlist/detail", {
          params: {
            id: this.songListId
          }
        })
        .then(response => {
          // 判断拿取数据是否正确，反爬虫
          this.songdata = response.data.playlist;
          // 放入本地存储数据里面，设置过期时间
          window.localStorage.setItem(
            "sl-" + this.songListId,
            JSON.stringify({
              val: this.songdata,
              time: Date.now() + 2 * 60 * 60 * 1000
            })
          );
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getPlaylist: function() {
      this.axios
        .get("/comment/playlist", {
          params: {
            id: this.songListId
          }
        })
        .then(response => {
          // 判断拿取数据是否正确，反爬虫
          this.playdata = response.data;
          // 放入本地存储数据里面，设置过期时
          window.localStorage.setItem(
            "pl-" + this.songListId,
            JSON.stringify({
              val: this.playdata,
              time: Date.now() + 6 * 60 * 60 * 1000
            })
          );
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    checklocal: function() {
      let cacheSonglist = JSON.parse(
        window.localStorage.getItem("sl-" + this.songListId)
      );
      let cachePlaylist = JSON.parse(
        window.localStorage.getItem("pl-" + this.songListId)
      );
      if (cacheSonglist && cacheSonglist.time > Date.now()) {
        this.songdata = cacheSonglist.val;
      } else {
        this.getSonglist();
      }
      // 拿取歌单
      if (cachePlaylist && cachePlaylist.time > Date.now()) {
        this.playdata = cachePlaylist.val;
      } else {
        this.getPlaylist();
      }
    },
    counttime: function(time) {
      let date = new Date(time);
      let year = date.getFullYear();
      let mouth = date.getMonth();
      let day = date.getDay();
      return `${year}年${mouth}月${day}日`;
    }
  },
  created() {
    this.checkenter = true;
    this.checklocal();
    setTimeout(() => {
      this.checkenter = false;
      // console.log(vm);
    }, 2000);
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.checkenter = true;
      vm.songListId = to.query.id;
      setTimeout(() => {
        vm.checkenter = false;
        // console.log(vm);
      }, 2000);
    });
  },
  //   路由更新守卫,想要复用,同级组件的跳转
  beforeRouteUpdate(to, from, next) {
    // console.log(to, from);
    this.songListId = to.query.id;
    // this.checklocal();
    next();
  },
  watch: {
    // keep-alive 保存存活 组件完成之后就不会消耗 组件创建完成之后不会销毁
    songListId: function() {
      this.checklocal();
    }
  }
};
</script>
<style lang="less" scoped>
.homeplaylist {
  position: relative;
  .playlistmask {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    position: absolute;
    top: 0;
    left: 0;
    z-index: 66;
    img {
      position: fixed;
      top: 30%;
      left: 35%;
      width: 100px;
    }
  }
  .header {
    height: 166px;
    width: 100%;
    display: flex;
    padding: 20px 10px;
    overflow: hidden;
    color: #fff;
    position: relative;
    // align-content: center;
    .mask {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: -1;
      filter: blur(30px) brightness(0.8);
      transform: scale(1.5);
      background-position: center;
    }
    .titleimg {
      flex-basis: 35.5%;
      height: 100%;
      position: relative;
      img {
        width: 100%;
      }
      span.headercount {
        position: absolute;
        top: 0;
        right: 0;
        font-size: 12px;
        background: rgba(0, 0, 0, 0.2);
        padding: 2px;
        img {
          height: 12px;
          width: 12px;
          vertical-align: middle;
          margin-bottom: 3px;
        }
      }
      .playlisttitle {
        position: absolute;
        top: 10px;
        left: 0;
        color: #fff;
        background: rgba(217, 48, 48, 0.8);
        border-top-right-radius: 17px;
        border-bottom-right-radius: 17px;
        line-height: 17px;
        height: 17px;
        text-align: center;
        font-size: 9px;
        padding: 0 8px;
      }
    }
    .header-right {
      padding-top: 1px;
      margin-left: 16px;
      h4 {
        font-weight: 500;
        font-size: 17px;
      }
      .header-rtoop {
        margin-top: 20px;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.7);
        img {
          border-radius: 50%;
          height: 30px;
          width: 30px;
          vertical-align: middle;
          margin-right: 5px;
        }
        span {
        }
      }
    }
  }
  .labelcontent {
    padding: 10px 10px 0px 15px;
    color: #666;
    background: #f8f8f8;
    h5 {
      font-size: 14px;
      margin-bottom: 10px;
      span {
        border-radius: 14px;
        display: inline-block;
        padding: 1px 8px;
        font-size: 12px;
        margin-right: 10px;
        font-weight: 400;
        border: rgba(0, 0, 0, 0.1) solid 0.5px;
        position: relative;
        top: -1px;
        line-height: 20px;
      }
      span:first-child {
        margin-left: 10px;
      }
    }
    .labeldescrip {
      overflow: hidden;
      text-emphasis: ellipsis;
      font-size: 14px;
      line-height: 19px;
      color: #666;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      word-spacing: 1em;
      white-space: pre-wrap;
      &.show {
        height: auto;
        display: block;
        white-space: pre-wrap;
        vertical-align: baseline;
      }
    }
    .more {
      overflow: hidden;
      i {
        float: right;
        font-size: 20px;
      }
    }
    // height: 70px;
  }
  .content {
    .contentitle {
      background: #eeeff0;
      height: 23px;
      line-height: 23px;
      padding: 0 10px;
      font-size: 12px;
      color: #666;
    }
    .contentdetails {
      background: #f8f8f8;
      li {
        display: flex;
        align-items: center;
        font-size: 17px;

        .songorder {
          width: 40px;
          color: #999;
          flex-basis: 10%;
          // background-color: pink;
          text-align: center;
          color: #999;
          // margin-left: -10px;
        }
        .songlistfl {
          flex-basis: 78%;
          padding: 6px 0;
          color: #333;
          cursor: pointer;
          font-size: 14px;
          // background-color: skyblue;
          border-bottom: 0.5px solid #e7e7e7;
          h3 {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            white-space: pre-wrap;
            width: 100%;
            font-size: 17px;
          }
          p {
            font-size: 12px;
            color: #888;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            white-space: pre-wrap;
          }
        }
        .songlistright {
          flex-basis: 12%;
          color: #e0e0e0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 0.5px solid #e7e7e7;
          height: 51.6px;
          img {
            width: 24px;
            height: 24px;
          }
        }
      }
    }
    .contenthotcomments,
    .contentcomments {
      background: #f8f8f8;
      .conhotc-top {
        display: flex;
        padding-top: 10px;
        .conhotc-top-left {
          flex-basis: 15%;
          // background: skyblue;
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            margin-left: 5px;
            border-radius: 50%;
            width: 30px;
            height: 30px;
          }
        }
        .talkman {
          flex-basis: 60%;
          // background: pink;
          h5 {
            font-size: 14px;
            line-height: 20px;
            color: #666;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          p {
            font-size: 9px;
            color: #999;
          }
        }
        .likecount {
          flex-basis: 25%;
          text-align: right;
          // background: orange;
          padding-right: 10px;
        }
      }
      .conhotc-bottom {
        width: 85%;
        margin-left: 15%;
        p {
          // flex-basis: 85%;
          padding-right: 10px;
          margin-top: 5px;
        }
        color: #333;
        font-size: 15px;
        line-height: 22px;
        padding-bottom: 11px;
        border-bottom: 0.5px solid #e7e7e7;
      }
    }
  }
}
</style>
