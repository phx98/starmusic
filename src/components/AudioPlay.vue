<template>
  <div class="playbar">
    <!-- bottom -->
    <template v-if="currentSong">
      <div class="playbarbottom" @click="showFullscreen = true">
        <img class="thumb" :class="{active: playing}" :src="currentSong.al.picUrl" alt />
        <div class="info">
          <h5>{{currentSong.name}}</h5>
          <span>{{currentSong.ar[0].name}}</span>
        </div>
        <div class="progress" @click.stop="playing = !playing">
          <canvas width="36" height="36" id="canvas"></canvas>
          <i v-if="playing" class="fa fa-pause"></i>
          <i v-else class="fa fa-play"></i>
        </div>
        <div class="playlist" @click.stop="$emit('show-playlist')">
          <i class="fa fa-bars" aria-hidden="true"></i>
        </div>
      </div>

      <!-- fullscreen -->
      <transition
        name="custom-classes-transition"
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <div v-show="showFullscreen" class="fullscreenplay">
          <div class="mask" :style="{backgroundImage: `url(${ currentSong.al.picUrl })`}"></div>
          <header>
            <!-- <i class="fa fa-arrow-left" @click="showFullscreen = false"></i> -->
            <img src="../assets/return1.svg" @click="showFullscreen = false" />
            <div class="songdetailtop">
              <h4>{{currentSong.name}}</h4>
              <span>{{currentSong.ar[0].name}}</span>
            </div>
            <div class="share">
              <img src="../assets/share1.svg" alt  @click="showsharepage"/>
            </div>
          </header>
          <div
            v-show="showCircle"
            class="circle"
            :class="{active: playing}"
            @click="showCircle = false"
          >
            <div class="needle"></div>
            <div class="glue">
              <img :src="currentSong.al.picUrl" alt />
            </div>
            <ul class="circlebuttom">
              <li v-on:click.stop="heartactive = !heartactive">
                <img :src="heart" @click="switchheart" />
              </li>
              <li>
                <img src="../assets/download.svg" alt />
              </li>
              <li>
                <img src="../assets/bell.svg" alt />
              </li>
              <li>
                <img src="../assets/comments.svg" alt />
              </li>
              <li>
                <img src="../assets/details.svg" alt />
              </li>
            </ul>
          </div>
          <div v-show="!showCircle" class="lyric-box" @click="showCircle = true">
            <ul class="scroll" :style="{transform: `translateY(${-currentLyricIndex * 28}px)`}">
              <li
                v-for="(item, index) in parsedLyric"
                :class="{active: index===currentLyricIndex}"
                :key="index"
              >{{ processlyric(item.text) }}</li>
            </ul>
          </div>
          <transition
            name="classes-transition"
            enter-active-class="animated slideInUp"
            leave-active-class="animated slideOutDown"
          >
            <div v-if="showPlayList" class="showmenu" @click.self="showPlayList = false">
              <ul class="defaultPlayList">
                <h4>当前播放</h4>
                <span class="playlistnum">({{defaultPlay.length}})</span>
                <div class="playlisttitle">
                  <div class="model">
                    <img :src="audiomodel1" @click="switchaudiomodel" />
                    <span>{{audiomodelname}}</span>
                  </div>
                  <div class="addlist">
                    <img src="../assets/addlist.svg" alt />
                    <span>收藏全部</span>
                  </div>
                  <span class="trash">
                    |
                    <img src="../assets/trash.svg" alt />
                  </span>
                </div>
                <Singplaylist
                  v-for="(item, index) in defaultPlay"
                  :song="item"
                  :key="index"
                  :songid="currentSong.id"
                  @translate-song="$emit('translate-song', $event)"
                  @delete-playlist="$emit('delete-playlist', $event)"
                ></Singplaylist>
              </ul>
            </div>
          </transition>

          <transition
            name="classes-transition"
            enter-active-class="animated slideInUp"
            leave-active-class="animated slideOutDown"
          >
            <div class="showshare" v-show="showShare" @click.self ="showShare=false">
              <div class="showsharecontent">
                <img src="../assets/advert1.jpg" alt class="advert" />
                <img src="../assets/advert2.jpg" alt class="advert" />
                <h4>分享到</h4>
                <div class="shareimg">
                  <div class="weixin">
                    <img src="../assets/weixin.svg" alt />
                    <p>微信</p>
                  </div>
                  <div class="circlefriend">
                    <img src="../assets/circlefriend.svg" alt />
                    <p>朋友圈</p>
                  </div>
                  <div class="starmus">
                    <img src="../assets/starmusic.svg" alt />
                    <p>星星音乐</p>
                  </div>
                  <div class="qq">
                    <img src="../assets/qq.svg" alt />
                    <p>QQ好友</p>
                  </div>
                  <div class="qqspace">
                    <img src="../assets/qqspace.svg" alt />
                    <p>QQ空间</p>
                  </div>
                </div>
              </div>
            </div>
          </transition>
          <footer>
            <div class="divrange">
              <span>{{ arrangetime(audioprogress)}}</span>
              <input type="range" v-model="audiotime" max="100" class="inputrange" />
              <span class="totaltime">{{ arrangetime(currentSong.dt)}}</span>
              <audio :src="currentSongUrl" autoplay controls height="30"></audio>
            </div>
            <div class="footerbottom">
              <span class="audiomodel">
                <img :src="audiomodel" @click="switchaudiomodel" />
              </span>
              <span class="lastaudio">
                <img src="../assets/prevplay.svg" @click.stop="prevplayaudio" />
              </span>
              <span class="playaudio">
                <img :src="playaudio" @click="switchplayaudio" />
              </span>
              <span class="nextaudio">
                <img src="../assets/nextplay.svg" @click.stop="nextplayaudio" />
              </span>
              <span class="historyaudio" @click.stop="showmenu">
                <img src="../assets/musicmenu.svg" />
              </span>
            </div>
          </footer>
        </div>
      </transition>
    </template>
  </div>
</template>

<script>
import Singplaylist from "@/components/Singplaylist.vue";
export default {
  props: {
    currentSong: Object,
    defaultPlay: Array,
    collectSonglist: Array
  },
  components: {
    Singplaylist
  },
  data: function() {
    return {
      playing: false,
      showFullscreen: false,
      showCircle: true,
      currentLyric: null,
      currentLyricIndex: 0,
      showPlayList: false,
      // defaultPlayList: [this.currentSong],
      heartactive: true,
      audiotime: 0,
      audioprogress: Number,
      audiomodel: require("../assets/singlecycle.svg"),
      audiomodel1: require("../assets/singlecycle1.svg"),
      playaudio: require("../assets/pauseaudio.svg"),
      totaltime: "",
      nowtime: "",
      heart: require("../assets/heart_1.svg"),
      audiomodelname: "单曲循环",
      showShare: false
    };
  },
  methods: {
    // joinArtists: function(artists) {
    // return artists.map(artist => artist.name).join(" / ");
    // },
    // 小的播放器导航栏的转圈圈canvas
    drawProgress: function() {
      var canvas = this.$el.querySelectorAll("#canvas");
      var audio = this.$el.querySelectorAll("audio");

      var duration = this.currentSong.dt;

      audio.ontimeupdate = () => {
        /** @type {HTMLCanvasElement} */
        // console.log(canvas);
        // 获取canvas元素
        var context = canvas.getContext("2d");
        // console.log(duration, this.currentTime * 1000);
        // console.log((this.currentTime * 100) / duration);
        context.clearRect(0, 0, 36, 36);

        context.beginPath();
        context.arc(18, 18, 17, 0, 2 * Math.PI);
        context.closePath();
        context.strokeStyle = "gray";
        // 描边样式
        context.lineWidth = "1";
        // 描边宽度
        context.stroke(); // 路径描边

        context.beginPath();
        context.arc(
          18,
          18,
          17,
          -0.5 * Math.PI,
          -0.5 * Math.PI + 2 * Math.PI * ((audio.currentTime * 1000) / duration)
        );
        // context.closePath();
        context.strokeStyle = "rgba(255,0,0,0.7)";
        // 描边样式
        context.lineWidth = "1";
        // 描边宽度
        context.stroke(); // 路径描边

        // 滚动歌词
        // this.currentTime
        // currentLyricIndex
      };
    },
    lyrichighlight: function() {
      let index = 0;
      if (!this.parsedLyric.length) {
        this.currentLyricIndex = index;
        return;
      }
      for (let i = 0; i < this.parsedLyric.length; i++) {
        if (this.audioprogress < this.parsedLyric[i].time) {
          // console.log(this.audioprogress + 0.2, this.parsedLyric[i].time);
          index = i - 1;
          break;
        }
      }
      if (index === undefined) {
        index = this.parsedLyric.length - 1;
      }
      // console.log(this.currentLyricIndex, index);
      this.currentLyricIndex = index;
    },
    // 歌词的高亮更新
    getLyric: function() {
      var cachedLyric = window.localStorage.getItem(
        "lyric" + this.currentSong.id
      );

      if (cachedLyric) {
        this.currentLyric = cachedLyric;
      } else {
        window.axios
          .get("lyric", {
            params: {
              id: this.currentSong.id
            }
          })
          .then(response => {
            if (response.data.lrc) {
              this.currentLyric = response.data.lrc.lyric;
              window.localStorage.setItem(
                "lyric" + this.currentSong.id,
                response.data.lrc.lyric
              );
            } else {
              this.currentLyric = "[00:00.000] 纯音乐请欣赏";
              window.localStorage.setItem(
                "lyric" + this.currentSong.id,
                "[00:00.000] 纯音乐请欣赏"
              );
            }
          });
      }
    },
    // 播放器的进度条变化,我用了vue的事件监听函数addEventListener和removeEventListener来解决,感谢百度
    addEventListeners: function() {
      var audio = this.$el.querySelector("audio");
      audio.addEventListener("timeupdate", this._currentTime);
    },
    removeEventListeners: function() {
      var audio = this.$el.querySelector("audio");
      audio.removeEventListener("timeupdate", this._currentTime);
    },
    _currentTime: function() {
      var audio = this.$el.querySelector("audio");
      this.audioprogress = parseInt(audio.currentTime);
    },
    switchaudiomodel: function() {
      // 单曲循环
      if (this.audiomodel == require("../assets/singlecycle.svg")) {
        this.audiomodel = require("../assets/randomplay.svg");
        this.audiomodel1 = require("../assets/randomplay1.svg");
        this.audiomodelname = "随机播放";
      } else if (this.audiomodel == require("../assets/randomplay.svg")) {
        // 随机播放
        this.audiomodel = require("../assets/loopplay.svg");
        this.audiomodel1 = require("../assets/loopplay1.svg");
        this.audiomodelname = "列表循环";
      } else if (this.audiomodel == require("../assets/loopplay.svg")) {
        // 列表循环
        this.audiomodel = require("../assets/singlecycle.svg");
        this.audiomodel1 = require("../assets/singlecycle1.svg");
        this.audiomodelname = "单曲循环";
      }
    },
    switchplayaudio: function() {
      // var  audio
      if (this.playaudio == require("../assets/playaudio.svg")) {
        this.playaudio = require("../assets/pauseaudio.svg");
        this.playing = true;
      } else if (this.playaudio == require("../assets/pauseaudio.svg")) {
        this.playaudio = require("../assets/playaudio.svg");
        this.playing = false;
      }
    },
    // 歌词的加工去掉前面的时间字符
    processlyric: function(text) {
      // console.log(text);
      var x = text;
      if (text != undefined) {
        x = text.replace(/\[.*:.*\]/, "");
      }
      return x;
    },
    arrangetime: function(time) {
      if (time > 10000) {
        time = (time / 1000).toFixed(0);
      }
      var minute = (time / 60).toFixed(0);
      minute = minute < 10 ? "0" + minute : minute;
      var second = time % 60 < 10 ? "0" + (time % 60) : time % 60;
      return minute + ":" + second;
    },
    switchheart: function() {
      this.$emit("change-collect");
      if (this.heart == require("../assets/heart_1.svg")) {
        this.heart = require("../assets/heart.svg");
      } else {
        this.heart = require("../assets/heart_1.svg");
      }
    },
    prevplayaudio: function() {
      let i;
      if (this.audiomodel == require("../assets/randomplay.svg")) {
        i = Math.floor(Math.random() * this.defaultPlay.length);
      } else {
        this.defaultPlay.map((item, index) => {
          if (item.id == this.currentSong.id) {
            i = index;
          }
        });
        if (i == 0) {
          i = this.defaultPlay.length - 1;
        } else {
          i = i - 1;
        }
      }
      this.$emit("translate-song", this.defaultPlay[i].id);
      // console.log(i);
    },
    nextplayaudio: function() {
      let i;
      // 如果是单曲循环或者是列表循环,就按照歌单里面的顺序来,如果不是,就随机播放
      if (this.audiomodel == require("../assets/randomplay.svg")) {
        i = Math.floor(Math.random() * this.defaultPlay.length);
      } else {
        this.defaultPlay.map((item, index) => {
          if (item.id == this.currentSong.id) {
            i = index;
          }
        });
        if (i + 1 >= this.defaultPlay.length) {
          i = 0;
        } else {
          i = i + 1;
        }
      }
      this.$emit("translate-song", this.defaultPlay[i].id);
      // console.log(i);
    },
    showmenu: function() {
      this.showPlayList = !this.showPlayList;
    },
    playaudiomodel: function() {
      // console.log("进来改函数了");
      if (this.audiomodel == require("../assets/singlecycle.svg")) {
        //  单曲循环
        this.playing = true;
        // console.log("单曲循环");
      } else if (this.audiomodel == require("../assets/randomplay.svg")) {
        // 随机播放
        let i = Math.floor(Math.random() * this.defaultPlay.length);
        this.$emit("translate-song", this.defaultPlay[i].id);
        // console.log("随机播放");
      } else if (this.audiomodel == require("../assets/loopplay.svg")) {
        // 列表循环
        this.nextplayaudio();
        // console.log("列表循环");
      }
    },
    showsharepage:function () {
      this.showShare = true;
      }
  },

  computed: {
    currentSongUrl: function() {
      if (this.currentSong)
        return `https://music.163.com/song/media/outer/url?id=${this.currentSong.id}.mp3`;
      else return "";
    },
    parsedLyric: function() {
      if (this.currentLyric) {
        return this.currentLyric.split("\n").map(item => {
          // console.log(item);
          var regex = /\d{2}:\d{2}\.\d+/i;
          if (item.search(regex) !== -1) {
            var time = item.match(regex)[0];
            var m = time.substr(0, 2);
            var s = time.substr(3, 2);
            var n = time.substr(5);
            return {
              time: Number(m) * 60 + Number(s) + Number(n),
              text: item.substr(11) || "---------"
            };
          } else {
            return {};
          }
        });
      } else {
        return [{ time: 0, text: "暂时没有歌词" }];
      }
    }
  },

  mounted() {
    var audio = this.$el.querySelector("audio");
    this.drawProgress();

    audio.onplay = () => {
      // console.log("开始播放");
      this.playing = true;
    };
    audio.onpause = () => {
      // console.log("暂停播放");
      this.playing = false;
    };
    this.addEventListeners();
  },

  watch: {
    currentSong: function() {
      // console.log("变化了");
      this.getLyric();
      var err = this.collectSonglist.some(item => {
        if (item == this.currentSong.id) {
          return true;
        }
      });
      if (err) {
        this.heart = require("../assets/heart.svg");
      } else {
        this.heart = require("../assets/heart_1.svg");
      }
      // console.log(err);
    },
    playing: function(value) {
      var audio = this.$el.querySelector("audio");
      if (value) {
        audio.play();
        this.playaudio = require("../assets/pauseaudio.svg");
      } else {
        audio.pause();
        this.playaudio = require("../assets/playaudio.svg");
      }
    },
    audiotime: function(newvalue, oldvalue) {
      var audio = this.$el.querySelector("audio");
      // console.log(newvalue, oldvalue);
      if (newvalue - oldvalue > 1 || oldvalue - newvalue > 1) {
        audio.currentTime = (newvalue * audio.duration) / 100;
      }
      var range = this.$el.querySelectorAll(".inputrange");
      // console.log(range[0].style);
      range[0].style.background = `linear-gradient(to right,
     #fafafa ${this.audiotime}%, #c1c1c1 ${this.audiotime}%, #c1c1c1 ${100 -
        this.audiotime}%)`;
    },
    audioprogress: function() {
      var audio = this.$el.querySelector("audio");
      this.audiotime = (this.audioprogress / audio.duration) * 100;

      if (this.audiotime > 99) {
        this.audiotime = 0;
        this.playing = false;
        this.playaudiomodel();
        // this.nextplayaudio();
      }
      this.lyrichighlight();
    }
  },
  created() {
    this.getLyric();
  },
  beforeDestroyed() {
    this.removeEventListeners();
  }
};
</script>

<style lang="less" scoped>
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.playbar {
  .playbarbottom {
    padding: 5px 0;
    background: white;
    border-top: 1px solid rgba(128, 128, 128, 0.2);
    display: flex;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 10;
    .margin () {
      margin: 0 10px;
    }
    .thumb {
      .margin;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      animation: rotate 6s linear infinite;
      animation-play-state: paused;
      &.active {
        animation-play-state: running;
      }
    }
    .info {
      flex: 1;
      font-size: 12px;
      line-height: 18px;
      h5 {
      }
      span {
        color: gray;
      }
    }
    .progress {
      .margin;
      width: 28px;
      height: 28px;
      // background: lightgray;
      position: relative;
      #canvas {
        width: 100%;
      }
      i {
        position: absolute;
        top: 50%;
        left: 50%;
        color: lightgray;
        font-size: 12px;
        display: block;
        margin-top: -6px;
        margin-left: -6px;
        line-height: 1em;
        width: 12px;
        height: 12px;
        text-align: center;
      }
    }
    .playlist {
      .margin;
      width: 28px;
      height: 28px;
      // background: red;
      position: relative;
      border: 1px solid lightgray;
      border-radius: 50%;
      i {
        position: absolute;
        top: 50%;
        left: 50%;
        color: lightgray;
        font-size: 12px;
        display: block;
        margin-top: -6px;
        margin-left: -6px;
        line-height: 1em;
        width: 12px;
        height: 12px;
        text-align: center;
      }
    }
  }

  .fullscreenplay {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    .mask {
      filter: blur(30px) brightness(0.5);
      transform: scale(2);
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      background-color: rgba(0, 0, 0, 0.3);
      position: absolute;
      z-index: -1;
    }
    header {
      height: 50px;
      line-height: 50px;
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
        margin-top: 10px;
        width: 60%;
        h4 {
          font-size: 20px;
          color: #fff;
          margin: 0px;
          padding: 0px;
          line-height: 20px;
          padding-top: 2px;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          display: -webkit-box;
          // background: pink;
        }
        span {
          color: #bcbcbc;
          font-size: 12px;
          margin: 0px;
          padding: 0px;
          line-height: 12px;
          // background: green;
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
    .circle {
      flex: 1;
      text-align: center;
      position: relative;
      .glue {
        padding: 54px;
        // background: red;
        background-image: url("../assets/disc_light-ip6.png"),
          url("../assets/disc-ip6.png");
        background-size: 100%;
        border-radius: 50%;
        display: inline-block;
        margin-top: 84px;
        animation: rotate 6s linear infinite;
        animation-play-state: paused;

        img {
          width: 180px;
          height: 180px;
          border-radius: 50%;
          vertical-align: middle;
        }
      }
      .needle {
        width: 96px;
        height: 137px;
        background-image: url("../assets/needle.png");
        background-size: 100%;
        position: absolute;
        top: 0;
        left: 50%;
        z-index: 1;
        margin-left: -16px;
        transform: rotate(-12deg);
        transform-origin: 16px 0;
        transition: all 0.3s;
      }
      &.active {
        .needle {
          transform: rotate(0deg);
        }
        .glue {
          animation-play-state: running;
        }
      }
      .circlebuttom {
        display: flex;
        position: absolute;
        bottom: 10px;
        width: 100%;
        li {
          flex-basis: 25%;
          img {
            width: 28px;
            height: 28px;
            vertical-align: bottom;
          }
        }
      }
    }
    .lyric-box {
      flex: 1;
      overflow: hidden;
      position: relative;
      align-content: center;

      .scroll {
        text-align: center;
        position: absolute;
        width: 100%;
        height: 100%;
        // top: 10%;
        top: 30%;
        // background: skyblue;
        margin-top: -3em;
        transition: transform 0.3s;
        li {
          line-height: 3em;
          font-size: 14px;
          height: 3em;
          color: gray;
          &.active {
            color: white;
          }
        }
      }
    }
    .showmenu {
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
      box-shadow: 0px -10px 10px 10px rgba(0, 0, 0, 0.3);
      z-index: 8;
      position: fixed;
      top: 0px;
      left: 0px;
      .defaultPlayList {
        position: fixed;
        bottom: 10px;
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
    .showshare {
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
      z-index: 8;
      position: fixed;
      top: 0px;
      left: 0px;
      .showsharecontent {
        position: fixed;
        bottom: 10px;
        left: 0;
        width: 95%;
        box-sizing: border-box;
        padding: 20px 10px;
        background: white;
        border-radius: 15px;
        z-index: 9;
        
        .advert {
          width: 50%;
          height: 80px;
        }
        h4 {
          color: #000;
          font-size: 18px;
          margin-top: 10px;
        }
        .shareimg {
          display: flex;
          // margin-top: 20px;
          justify-content: space-around;
          flex-wrap: wrap;
          & > div {
            flex-basis: 20%;
            text-align: center;
          }
          img {
            width: 25px;
          }
        }
      }
    }
    footer {
      height: 100px;
      // background: lightblue;
      .divrange {
        text-align: center;
        // display: flex;
        span {
          // background: skyblue;
          font-size: 12px;
          position: relative;
          top: 2px;
          color: #bcbcbc;
          &:first-child {
            margin-right: 7px;
            top: 2px;
          }
          &.totaltime {
            margin-left: 7px;
          }
        }
        audio {
          display: none;
        }
        input[type="range"] {
          -webkit-appearance: none;
          width: 280px;
          border-radius: 10px;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
        }
        input[type="range"]::-webkit-slider-runnable-track {
          height: 5px;
          border-radius: 10px; /*将轨道设为圆角的*/
          box-shadow: 0 1px 1px #def3f8, inset 0 0.125em 0.125em #0d1112; /*轨道内置阴影效果*/
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 8px;
          width: 8px;
          margin-top: -1px;
          // margin-left: -1px;
          /*使滑块超出轨道部分的偏移量相等*/
          background: #fff;
          border-radius: 50%;
          /*外观设置为圆形*/
          // opacity: 0;
          border: solid 0.125em rgba(205, 224, 230, 0.5); /*设置边框*/
          box-shadow: 0 0.125em 0.125em #3b4547; /*添加底部阴影*/
        }
        input[type="range"]:focus {
          outline: none;
        }
        .inputrange {
          width: 80%;
          // background-image: linear-gradient(to right,red,#fff);
          background: #fff;
        }
      }
      .footerbottom {
        width: 100%;
        // background: skyblue;
        margin-top: 15px;
        display: flex;
        span {
          flex-basis: 20%;
          // background: red;
          justify-content: center;
          display: flex;
          align-items: center;
          img {
            width: 40%;
            vertical-align: middle;
          }
          &.audiomodel {
            img {
              width: 35%;
            }
          }
          &.playaudio {
            img {
              width: 60%;
            }
          }
          &.historyaudio {
            img {
              width: 25%;
            }
          }
        }
      }
    }
  }

  .fadeIn {
    animation-duration: 0.3s;
  }
}
</style>