<template>
  <div id="app" @touchstart="apptouchstart" @touchend="apptouchend">
    <!-- 一级路由出口 -->
    <keep-alive>
      <router-view
        @translate-song="songid= $event,checkgetsongdetail()"
        :songid="songid"
        @login-use="userinfo = $event,localuserinfo()"
        :username="userinfo.username"
        :localSonglist="localSonglist"
        :collectSonglist="collectSonglist"
        :defaultPlayList="defaultPlayList"
        :loginuid ="loginuid"
        @empty-currentsng ="songdetails = null"
      ></router-view>
    </keep-alive>
    <!-- 播放器 -->
    <!-- 做一个左滑右滑的播放器组件 -->
    <AudioPlay
      v-if="songdetails"
      :currentSong="songdetails"
      @show-playlist="showsongPlayList"
      :defaultPlay="defaultPlayList"
      @translate-song="songid= $event,checkgetsongdetail()"
      @delete-playlist="deleteplaylist"
      @change-collect="changecollectSonglist"
      :collectSonglist="collectSonglist"
    ></AudioPlay>
    <!-- 播放列表 -->
    <transition
      name="custom-classes-transition"
      enter-active-class="animated slideInUp"
      leave-active-class="animated slideOutDown"
    >
      <div class="showmenu" v-if="showPlayList" @click.self="showPlayList = false">
        <ul class="defaultPlayList">
          <h4>当前播放</h4>
          <span class="playlistnum">({{defaultPlayList.length}})</span>
          <div class="playlisttitle">
            <div class="model">
              <img :src="audiomodel" @click="switchaudiomodel" />
              <span>{{audiomodelname}}</span>
            </div>
            <div class="addlist">
              <img src="./assets/addlist.svg" alt />
              <span>收藏全部</span>
            </div>
            <span class="trash">
              |
              <img src="./assets/trash.svg" alt />
            </span>
          </div>
          <Singplaylist
            v-for="(item, index) in defaultPlayList"
            :song="item"
            :key="index"
            :songid="songid"
            @delete-playlist="deleteplaylist"
            @translate-song="songid= $event,checkgetsongdetail()"
          ></Singplaylist>
        </ul>
      </div>
    </transition>
  </div>
</template>
<script>
import AudioPlay from "@/components/AudioPlay.vue";
import Singplaylist from "@/components/Singplaylist.vue";
export default {
  methods: {
    apptouchstart: function(event) {
      // console.log("开始", event);
      //  console.log(event.changedTouches[0].clientX);
      this.touchstartX = event.changedTouches[0].clientX;
      this.touchstartY = event.changedTouches[0].clientY;
    },
    apptouchend: function(event) {
      // console.log("结束", event);
      // console.log(event.changedTouches[0].clientX);
      this.touchendX = event.changedTouches[0].clientX;
      this.touchendY = event.changedTouches[0].clientY;
      if (this.touchendX - this.touchstartX > 50) {
        // 符合条件为右滑
        this.routerBack();
        this.touchendX = 0;
        this.touchendY = 0;
        this.touchstartX = 0;
        this.touchstartY = 0;
      }
      if (this.touchendX - this.touchstartX < -50) {
        // 符合条件为右滑
        this.routerForward();
        this.touchendX = 0;
        this.touchendY = 0;
        this.touchstartX = 0;
        this.touchstartY = 0;
      }
    },
    routerBack: function() {
      this.$router.back();
    },
    routerForward: function() {
      this.$router.forward();
    },
    getsongdetail: function() {
      this.axios
        .get("/song/detail", {
          params: {
            ids: this.songid
          }
        })
        .then(response => {
          // console.log(response);
          this.songdetails = response.data.songs[0];
          // console.log("我来拿数据了,你是不是没存本地呀?辣");
          // console.log(this.songdetails);
          // 放入本地存储数据里面，设置过期
          window.localStorage.setItem(
            this.songid + "details",
            JSON.stringify({
              val: this.songdetails
            })
          );
          this.localSonglist.push({
            id: this.songid + "details",
            ar: this.songdetails.ar,
            name: this.songdetails.name
          });
          let isExist = this.defaultPlayList.some(item => {
            return item.id == this.songid;
          });
          // console.log(isExist);
          if (!isExist) this.defaultPlayList.push(this.songdetails);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    checkgetsongdetail: function() {
      let cacheSongdetail = JSON.parse(
        window.localStorage.getItem(this.songid + "details")
      );
      if (cacheSongdetail) {
        this.songdetails = cacheSongdetail.val;
        let isExist = this.defaultPlayList.some(item => {
          return item.id == this.songid;
        });
        // console.log(isExist);
        if (!isExist) this.defaultPlayList.push(this.songdetails);
      } else {
        this.getsongdetail();
      }
    },
    showsongPlayList: function() {
      this.showPlayList = !this.showPlayList;
    },
    switchaudiomodel: function() {
      if (this.audiomodel == require("./assets/singlecycle1.svg")) {
        this.audiomodel = require("./assets/randomplay1.svg");
        this.audiomodelname = "随机播放";
      } else if (this.audiomodel == require("./assets/randomplay1.svg")) {
        this.audiomodel = require("./assets/loopplay1.svg");
        this.audiomodelname = "单曲循环";
      } else if (this.audiomodel == require("./assets/loopplay1.svg")) {
        this.audiomodel = require("./assets/singlecycle1.svg");
        this.audiomodelname = "列表循环";
      }
    },
    deleteplaylist: function(id) {
      let isExist = this.defaultPlayList.some((item, index) => {
        if (item.id == id) {
          return index;
        }
      });
      // console.log(isExist);
      this.defaultPlayList.splice(isExist, 1);
      if (this.songid == id) {
        console.log("此时删除的就是正在播放的歌");

        if (this.defaultPlayList[isExist] == undefined) {
          isExist = 0;
          if (this.defaultPlayList[0] == undefined) {
            this.$router.go(0);
          }
        }
        this.songid = this.defaultPlayList[isExist].id;
      }
    },
    localuserinfo: function() {
      window.localStorage.setItem(
        "login",
        JSON.stringify({
          val: this.userinfo
        })
      );
    },
    localSongnum: function() {
      let num = [];
      Object.keys(window.localStorage).forEach(item => {
        if (item.indexOf("details") >= 0) {
          let song = JSON.parse(window.localStorage.getItem(item)).val;
          this.localSonglist.push({
            id: song.id,
            name: song.name,
            ar: song.ar
          });
          num.push(item);
        }
      });
      // this.localSonglist = num;
    },
    changecollectSonglist: function() {
      // 从里面找到了歌曲,说明是取消收藏

      let err = this.collectSonglist.some((item, index) => {
        if (item.id == this.songid) {
          this.collectSonglist.splice(index, 1);
          return true;
        }
      });
      if (err == false) {
        this.collectSonglist.push({
          id: this.songid,
          name: this.songdetails.name,
          ar: this.songdetails.ar
        });
      }
      return err;
    },
    // 登良我的账号拿我的数据
    loginmineaccount: function() {
      this.$axios
        .get("/login/cellphone", {
          params: {
            phone: 18218437099,
            password: "PHx983232"
          }
        })
        .then(response => {
          // console.log(response);
          this.loginuid = response.data.account.id;
          window.localStorage.setItem(
            "loginmine",
            JSON.stringify({
              val: response.data.account
            })
          );
        });
    },
    // 检查是否本地已经存储了登录账号
    checklocalloginmine: function() {
      let checkloginmine = JSON.parse(window.localStorage.getItem("loginmine"));
      if (checkloginmine) {
        this.loginuid = checkloginmine.val.id;
      } else {
        this.loginmineaccount();
      }
    }
  },
  data: function() {
    return {
      playaudio: "",
      touchstartX: 0,
      touchendX: 0,
      touchstartY: 0,
      touchendY: 0,
      songid: 1111,
      songdetails: null,
      showPlayList: false,
      defaultPlayList: [
        {
          id: 1446522140,
          name: "最好的幸运",
          ar: [
            {
              name: "李凯馨"
            }
          ]
        },
        {
          id: 1398850429,
          name: "夜的钢琴曲5",
          ar: [
            {
              name: "文武贝"
            }
          ]
        },
        {
          id: 393685,
          name: "故乡的原风景",
          ar: [
            {
              name: "宗次郎"
            }
          ]
        }
      ],
      audiomodel: require("./assets/singlecycle1.svg"),
      audiomodelname: "列表循环",
      userinfo: {
        username: "",
        password: ""
      },
      localSonglist: [],
      collectSonglist: [],
      loginuid: 1111,
    };
  },
  components: {
    AudioPlay,
    Singplaylist
  },
  watch: {
    songid: function() {
      // console.log('值改变了');
      this.checkgetsongdetail();

    }
  },
  created() {
    let cacheLogin = JSON.parse(window.localStorage.getItem("login"));
    if (cacheLogin) {
      this.userinfo = cacheLogin.val;
    }
    this.localSongnum();
    this.checklocalloginmine();
  }
};
</script>
<style lang="less">
html {
  height: 100%;
}
body {
  height: 100%;
}
#app {
  height: 100%;
}

@red: #42b983;
#nav {
  display: flex;
  text-align: center;
  border-bottom: 1px solid lightgray;
  height: 40px;
  font-size: 18px;
  li {
    flex: 1;
    list-style: none;
  }
  a {
    color: #2c3e50;
    text-decoration: none;
    line-height: 38px;
    display: inline-block;

    padding: 0 3px;
    box-sizing: border-box;

    &.router-link-exact-active {
      color: @red;
      border-bottom: 2px solid @red;
    }
  }
}
.showmenu {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
  box-shadow: 0px -10px 10px 10px rgba(0, 0, 0, 0.1);
  z-index: 8;
  position: fixed;
  top: 0px;
  left: 0px;
  .defaultPlayList {
    position: fixed;
    bottom: 50px;
    left: 2.5%;
    width: 95%;
    padding: 20px 10px;
    background: white;
    border-radius: 15px;
    box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.3);
    z-index: 9;
    h4 {
      font-weight: 600;
      color: #000;
      float: left;
      font-size: 18px;
    }
    .playlistnum {
      color: #bcbcbc;
      font-size: 16px;
      margin-left: 5px;
      // background: skyblue;
      line-height: 25px;
    }
    .playlisttitle {
      display: flex;
      margin-top: 10px;
      color: #000;
      .model {
        flex-basis: 55%;
      }
      .addlist {
        flex-basis: 30%;
      }
      .trash {
        color: #dcdcdc;
        flex-basis: 15%;
        img {
          margin-left: 27px;
          margin-right: 0px;
        }
      }
      img {
        width: 15px;
        height: 15px;
        // color: #ccc;
        margin-right: 5px;
        vertical-align: middle;
        margin-bottom: 1px;
      }
      font-size: 14px;
    }
  }
}
</style>
