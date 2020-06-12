<template>
  <div class="mine">
    <HomeLink></HomeLink>
    <Buffer v-if="showbuffer" class="buffer">正在加载我的页面</Buffer>
    <transition
      name="custom-classes-transition"
      enter-active-class="animated bounceIn"
      leave-active-class="animated fadeOut"
    >
      <AddPlaylist
        v-if="showadd"
        @cancel-add="showadd =false"
        @submit-newplaylist="addnewplaylist($event)"
      ></AddPlaylist>
    </transition>
    <!-- <p>Mine</p> -->
    <!-- <p>{{username}}</p> -->
    <div class="mineall" v-if="userdetail.profile">
      <div class="minetitle">
        <div class="minehead">
          <img src="../assets/portrait.png" alt />
        </div>
        <div class="username">
          <h4>{{username}}</h4>
          <p>
            <span>
              {{userdetail.profile.follows}}
              关注
            </span>
            <span>
              {{userdetail.profile.followeds}}
              粉丝
            </span>
          </p>
        </div>
        <div class="microphone">
          <img src="../assets/microphone.svg" alt />
        </div>
        <div class="addfriend">
          <img src="../assets/addfriend.svg" alt />
        </div>
      </div>
      <div class="allfunction">
        <div>
          <img src="../assets/local.svg" alt @click="showsonglist(localSonglist,1)" />
          <h4>本地</h4>
          <p>{{ locallength}}</p>
        </div>
        <div class="collect">
          <img src="../assets/collection.svg" alt @click="showsonglist(collectSonglist,2)" />
          <h4>收藏</h4>
          <p>{{collectlength}}</p>
        </div>
        <div>
          <img src="../assets/down.svg" alt @click="showsonglist(localSonglist,4)" />
          <h4>下载</h4>
          <p>{{ locallength}}</p>
        </div>
        <div class="cloud">
          <img src="../assets/clouddisk.svg" alt />
          <h4>云盘</h4>
          <p>0</p>
        </div>
        <div>
          <img src="../assets/buyed.svg" alt />
          <h4>已购</h4>
          <p>0</p>
        </div>
        <div>
          <img src="../assets/recently.svg" alt @click="showsonglist(defaultPlayList,3)" />
          <h4>最近</h4>
          <p>{{defaultlength}}</p>
        </div>
      </div>
      <div class="collectplaylist">
        <CollectTitle>收藏歌单</CollectTitle>
        <CollectContent :playlist="collectplaylist" @show-add="showadd =true"></CollectContent>
      </div>

      <button @click="exitlogin" class="exitlogin">退出登录</button>

      <transition
        name="MineSonglist"
        enter-active-class="animated flipInY"
        leave-active-class="animated fadeOutDown"
      >
        <div class="minesonglist" v-if="showMineSonglist">
          <h4>
            <img src="../assets/return2.svg" alt @click="showMineSonglist = !showMineSonglist" />
            {{Songlisttitle}}
          </h4>
          <div class="songlisttop"></div>
          <MineSonglist
            v-for="(item,index) in playlist"
            :item="item"
            :key="index"
            :songid="songid"
            @translate-song="$emit('translate-song',$event)"
          ></MineSonglist>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import HomeLink from "@/components/HomeLink.vue";
import MineSonglist from "@/components/MineSonglist.vue";
import CollectTitle from "@/components/CollectTitle.vue";
import Buffer from "@/components/Buffer.vue";
import CollectContent from "@/components/CollectContent.vue";
import AddPlaylist from "@/components/AddPlaylist.vue";

export default {
  components: {
    HomeLink,
    MineSonglist,
    CollectTitle,
    Buffer,
    CollectContent,
    AddPlaylist
  },
  data: function() {
    return {
      showMineSonglist: false,
      Songlisttitle: "",
      playlist: [],
      userdetail: {},
      collectplaylist: {},
      showbuffer: false,
      showadd: false
    };
  },
  props: {
    username: String,
    localSonglist: Array,
    collectSonglist: Array,
    defaultPlayList: Array,
    songid: Number,
    loginuid: Number
  },
  computed: {
    locallength: function() {
      return this.localSonglist.length;
    },
    collectlength: function() {
      return this.collectSonglist.length;
    },
    defaultlength: function() {
      return this.defaultPlayList.length;
    },
    loginid: function() {
      return this.loginuid;
    }
  },
  methods: {
    exitlogin() {
      console.log("退出登录");
      window.localStorage.removeItem("login");
      location.reload();
      this.$router.push({
        path: "/"
      });
    },
    showsonglist(playlist, num) {
      this.playlist = playlist;
      this.showMineSonglist = true;
      if (num == 1) {
        this.Songlisttitle = "本地音乐";
      } else if (num == 2) {
        this.Songlisttitle = "收藏列表";
      } else if (num == 3) {
        this.Songlisttitle = "最近播放";
      } else if (num == 4) {
        this.Songlisttitle = "下载列表";
      }
    },
    // 获取用户详情
    getloginuiddetail() {
      this.$axios
        .get("/user/detail", {
          params: {
            uid: this.loginid
          }
        })
        .then(res => {
          this.userdetail = res.data;
          window.localStorage.setItem(
            "loginminemsg",
            JSON.stringify({
              val: res.data
            })
          );
        });
    },
    // 存入本地看是否有用户详情数据
    checkloginminemsg() {
      let checklogin = JSON.parse(window.localStorage.getItem("loginminemsg"));
      if (checklogin) {
        this.userdetail = checklogin.val;
      } else {
        this.getloginuiddetail();
      }
    },
    // 获取用户歌单
    getuserplaylist() {
      this.$axios
        .get("/user/playlist", {
          params: {
            uid: this.loginid
          }
        })
        .then(res => {
          this.collectplaylist = res.data.playlist;
          window.localStorage.setItem(
            "usercollectplaylist",
            JSON.stringify({
              val: res.data.playlist
            })
          );
        });
    },
    // 检查用户歌单是否已经存到本地
    checkuserplaylist() {
      let checkplaylist = JSON.parse(
        window.localStorage.getItem("usercollectplaylist")
      );
      if (checkplaylist) {
        this.collectplaylist = checkplaylist.val;
      } else {
        this.getuserplaylist();
      }
    },
    addnewplaylist(newname) {
      this.showadd = false;
      newname;
    }
  },
  mounted() {
    this.checkloginminemsg();
    this.checkuserplaylist();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.showbuffer = true;
      setInterval(() => {
        vm.showbuffer = false;
      }, 2000);
    });
  }
};
</script>

<style lang="less" scoped>
.mine {
  height: 100%;
  .mineall {
    background: #e4f5ef;
    position: relative;
    text-align: center;
    .minesonglist {
      z-index: 2;
      height: 100%;
      width: 100%;
      background: #fff;
      position: absolute;
      top: 0px;
      & > h4 {
        background: #e4f5ef;
        img {
          width: 20px;
          vertical-align: middle;
          float: left;
          margin-top: 4px;
        }
        text-align: center;
        padding: 10px;
        font-size: 20px;
        padding-left: 30px;
        font-weight: 600;
      }
    }
  }
  .minetitle {
    display: flex;
    height: 110px;
    padding-top: 20px;
    width: 100%;
    .minehead {
      // padding: 30px;
      margin-left: 30px;
      img {
        border-radius: 50%;
        width: 80px;
      }
    }
    .username {
      margin-left: 20px;
      h4 {
        font-weight: 600;
        font-size: 20px;
        margin-top: 5px;
        margin-bottom: 20px;
        position: relative;
        text-align: left;
        &::after {
          content: "Lv.1";
          position: absolute;
          font-size: 10px;
          color: #fff;
          background: rgba(0, 0, 0, 0.3);
          padding: 2px 5px;
          border-radius: 8px;
          top: 0px;
          margin-left: 5px;
        }
      }
      p {
        color: #666;
        font-size: 16px;
        span {
          margin-right: 20px;
        }
      }
    }
    .microphone,
    .addfriend {
      margin-top: 35px;
      margin-left: 15px;
      img {
        width: 30px;
      }
    }
  }
  .allfunction {
    background: #fff;
    box-sizing: border-box;
    border-radius: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 20px 5px;
    margin-bottom: 20px;
    margin: 20px 10px;
    & > div {
      flex-basis: 33%;
      text-align: center;
      margin-top: 10px;
      margin-bottom: 10px;
      color: #000;
      font-size: 18px;
      img {
        width: 40px;
      }
      p {
        color: #666;
        font-size: 14px;
      }
    }
    .cloud {
      padding-top: 7px;
      margin-top: 8px;
      img {
        margin-bottom: 2.5px;
      }
    }
    .collect {
      img {
        margin-bottom: 4px;
      }
    }
  }
  .exitlogin {
    // flex-basis: 70%;
    width: 90%;
    font-size: 18px;
    padding: 10px;
    box-sizing: border-box;
    margin-top: 50px;
    background: #42b983;
    text-decoration: none;
    border: none;
    font-weight: 600;
    color: #333;
    border-radius: 20px;
    outline: none;
    margin-bottom: 80px;
  }
  .collectplaylist {
    margin: 0px 10px;
    border-radius: 20px;
    overflow: hidden;
    background: #fff;
  }
}
</style>