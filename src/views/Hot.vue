<template>
  <div class="hot">
    <HomeLink></HomeLink>
    <template v-if="hotlist">
      <div class="hotpot">
        <div class="hotpotimg"></div>
        <p>更新日期{{Refreshtime(hotlist.updateTime)}}</p>
      </div>
      <div class="hotcontent">
        <ul>
          <li
            v-for="(song,index) in hotlistshow"
            :key="index"
            @click="$emit('translate-song',song.id)"
          >
            <span class="songorder">{{ RankingCount(index + 1) }}</span>
            <div class="songlistfl">
              <h3 class="hotsongname">{{song.name}}</h3>
              <p>
                <span class="sghot"></span>
                <span>{{song.ar[0].name}}</span>
                -
                <span>{{song.al.name}}</span>
              </p>
            </div>
            <div class="songlistright">
              <img src="../assets/play2.svg" alt />
            </div>
          </li>
        </ul>
      </div>
      <div class="hotmore" @click="Addsongcount">
        <p>加载查看更多 ></p>
      </div>
    </template>
  </div>
</template>
<script>
import HomeLink from "@/components/HomeLink.vue";

export default {
  components: {
    HomeLink
  },
  data: function() {
    return {
      hotlist: null,
      hotlistcount: 20
    };
  },
  methods: {
    getHotList: function() {
      this.axios
        .get("/top/list?idx=1")
        .then(response => {
          // console.log(response.data.playlist);
          this.hotlist = response.data.playlist;
          window.localStorage.setItem(
            " hotlist",
            JSON.stringify({
              val: this.hotlist,
              time: Date.now() + 3 * 60 * 60
            })
          );
          // console.log(this.hotlist);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    CheckLocal: function() {
      let cacheHotlist = JSON.parse(window.localStorage.getItem("hotlist"));
      // console.log("created");

      if (cacheHotlist && cacheHotlist.time > Date.now()) {
        this.hotlist = cacheHotlist.val;
      } else {
        this.getHotList();
      }
    },
    Refreshtime: function(time) {
      let date = new Date(time);
      let mouth = date.getMonth() + 1;
      let day = date.getDate();
      day = day < 10 ? "0" + day : day;
      mouth = mouth < 10 ? "0" + mouth : mouth;
      return `${mouth}月${day}日`;
    },
    Addsongcount: function() {
      // console.log('加载更多');
      if (this.hotlistcount <= this.hotlist.tracks.length) {
        this.hotlistcount += 20;
      } else {
        this.hotlistcount = this.hotlist.tracks.length;
      }
    },
    RankingCount: function(e) {
      return e < 10 ? "0" + e : e;
    }
  },
  created() {
    this.CheckLocal();
  },
  mounted() {
    this.Refreshtime();
  },
  computed: {
    hotlistshow: function() {
      return this.hotlist.tracks.slice(0, this.hotlistcount);
    }
  }
};
</script>
<style lang="less" scoped>
.hot {
  .hotpot {
    width: 100%;
    height: 170px;
    background: url(../assets/hotpot.png);
    display: flex;
    align-content: center;
    flex-wrap: wrap;
    .hotpotimg {
      margin-left: 20px;
      width: 142px;
      height: 67px;
      background: url(../assets/sq.png);
      background-position: -24px -30px;
      background-size: 166px 97px;
    }
    p {
      flex-basis: 100%;
      margin-left: 20px;
      color: #fff;
      font-size: 12px;
      margin-top: 10px;
    }
  }
  .hotcontent {
    background: #f8f8f8;
    li {
      display: flex;
      align-items: center;
      .songorder {
        font-size: 17px;
        color: #999;
        flex-basis: 15%;
        text-align: center;
        // background: slateblue;
      }
      &:nth-child(-n + 3) .songorder {
        color: red;
      }
      .songlistfl {
        flex-basis: 70%;
        padding: 6px 0;
        color: #333;
        cursor: pointer;
        // background-color: skyblue;
        border-bottom: #ebebec solid 0.5px;
        h3.hotsongname {
          font-size: 17px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 200px;
        }
        p {
          font-size: 12px;
          color: #888;
          .sghot {
            display: inline-block;
            width: 12px;
            height: 8px;
            margin-right: 4px;
            background: url(../assets/sq.png);
            background-size: 166px 97px;
            background-position: 0 0;
          }
        }
      }
      .songlistright {
        flex-basis: 15%;
        color: #e0e0e0;
        justify-content: center;
        border-bottom: #ebebec solid 0.5px;
        padding-bottom: 11px;
        padding-top: 11px;
        img {
          width: 25px;
          height: 25px;
        }
        text-align: center;
      }
    }
  }
  .hotmore {
    padding: 50px 0;
    padding-top: 10px;
    background: #f8f8f8;
    text-align: center;
    color: #999;
    font-size: 14px;
  }
}
</style>
