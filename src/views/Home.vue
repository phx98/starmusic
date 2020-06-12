<template>
  <div class="home">
    <HomeLink></HomeLink>
    <div class="personalized">
      <CardTitle>推荐歌单</CardTitle>
      <ul class="songlist">
        <SongListCard v-for="(item, index) in randomPersonalizeds()" :key="index" :item="item"></SongListCard>
      </ul>
    </div>

    <div class="newsong">
      <CardTitle>推荐音乐</CardTitle>
      <ul class="musiclist">
        <RecommendMusic
          v-for="(song,index) in newsongs"
          :key="index"
          :song="song"
          :songid="songid"
          @translate-song="$emit('translate-song', $event)"
        ></RecommendMusic>
      </ul>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
import CardTitle from "@/components/CardTitle.vue";
import SongListCard from "@/components/SongListCard.vue";
import HomeLink from "@/components/HomeLink.vue";
import RecommendMusic from "@/components/RecommendMusic.vue";

export default {
  name: "Home",
  data: function() {
    return {
      personalizeds: [],
      newsongs: []
    };
  },
  props: {
    songid: Number
  },
  components: {
    // HelloWorld
    CardTitle,
    SongListCard,
    HomeLink,
    RecommendMusic
  },
  methods: {
    // 获取推荐歌单
    getPersonalized: function() {
      // console.log("我来拿数据了,你是不是没存本地呀?辣鸡");
      this.axios
        .get("/personalized")
        .then(response => {
          // 判断拿取数据是否正确，反爬虫
          // console.log("我来拿数据了,你是不是没存本地呀?辣鸡");
          // console.log(response);
          this.personalizeds = response.data.result;
          // 放入本地存储数据里面，设置过期时间
          window.localStorage.setItem(
            "personalizeds",
            JSON.stringify({
              val: this.personalizeds,
              time: Date.now() + 4 * 60 * 60 * 1000
            })
          );
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getNewSong: function() {
      this.axios
        .get("/personalized/newsong")
        .then(response => {
          this.newsongs = response.data.result;
          // console.log("我来拿数据了,你是不是没存本地呀?辣鸡");
          // 放入本地存储数据里面，设置过期
          window.localStorage.setItem(
            "newsongs",
            JSON.stringify({
              val: this.newsongs,
              time: Date.now() + 4 * 60 * 60
            })
          );
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    // 随机取六个推荐歌单
    randomPersonalizeds: function() {
      // 截取前六个
      // return [...this.personalizeds].slice(0,6)
      // 深拷贝数组
      var arr = [...this.personalizeds];

      var newArr = [];
      for (let i = 0; i < 6; i++) {
        var r = Math.floor(Math.random() * arr.length);
        newArr.push(...arr.splice(r, 1));
      }
      // console.log(newArr);

      return newArr;
    }
  },
  created() {
    // 每次创建组件都拿数据 太频繁 判断本地存储
    const cachePer = JSON.parse(window.localStorage.getItem("personalizeds"));
    const cacheSong = JSON.parse(window.localStorage.getItem("newsongs"));
    this.getNewSong();
    if (cacheSong && cacheSong.time > Date.now()) {
      // console.log('没过期');
      this.newsongs = cacheSong.val;
    } else {
      // console.log('过期了');
      this.getNewSong();
    }
    if (cachePer && cachePer.time > Date.now()) {
      // console.log('没过期');
      this.personalizeds = cachePer.val;
    } else {
      // console.log('过期了');
      this.getPersonalized();
    }
  }
};
</script>

<style lang="less">
.home {
  position: relative;
  background: #fcfcfd;
  .songlist {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>