<template>
  <div class="search">
    <HomeLink></HomeLink>
    <div class="searchinput">
      <span>
        <img src="../assets/search2.svg" alt />
      </span>
      <input
        type="text"
        v-model="searchtext"
        placeholder="搜索歌曲、歌手、专辑"
        @keyup.enter="searchsubmit(searchtext)"
      />
      <span @click="delsearchtext">
        <i class="fa fa-times-circle" v-if="showresult"></i>
      </span>
    </div>
    <template v-if="searchlist">
      <div class="hotsearch">
        <div class="searching" v-if="searchtext">
          <h3>搜索"{{ searchtext }}"</h3>
          <ul v-if="searchsuggest">
            <li
              v-for="(item,index) in searchsuggest"
              :key="index"
              @click="searchsubmit(item.keyword)"
            >
              <span>
                <img src="../assets/search2.svg" alt />
              </span>

              <p>{{item.keyword}}</p>
            </li>
          </ul>
        </div>
        <div class="hotsearchtext">
          <h5>热门搜索</h5>
          <span
            v-for="(item,index) in searchlist"
            :key="index"
            @click="searchsubmit(item.first)"
          >{{item.first}}</span>
        </div>
        <div class="searchresult" v-if="showresult">
          <h5>最佳匹配</h5>
          <ul>
            <li
              class="songdetail"
              @click="$emit('translate-song', song.id)"
              v-for="(song, index) in resultlist"
              :key="index"
            >
              <div class="songleft">
                <h3>{{ song.name }}</h3>
                <p>
                  <span class="sghot"></span>
                  <span>{{ song.artists[0].name }}</span>
                  -
                  <span>{{ song.album.name }}</span>
                </p>
              </div>
              <div class="songright">
                <!-- <i class="fa fa-play-circle-o"></i> -->
                <img src="../assets/play2.svg" alt />
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="searchhistory">
        <ul>
          <li v-for="( item , index ) in searchhistory" :key="index" @click="searchsubmit( item )">
            <span>
              <!-- <i class="fa fa-history"></i> -->
              <img src="../assets/history.svg" alt />
            </span>
            <div>
              <p>{{ item }}</p>
              <span class="delsearchhistory" @click.stop="searchhistory.splice(index,1)">
                <!-- <i class="fa fa-times"></i> -->
                <img src="../assets/delete.svg" />
              </span>
            </div>
          </li>
        </ul>
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
      searchtext: "",
      searchlist: null,
      searchhistory: ["写作业"],
      searchsuggest: [],
      showresult: false,
      resultlist: null
    };
  },
  methods: {
    getSearchList: function() {
      this.axios
        .get("/search/hot")
        .then(response => {
          // console.log(response.data.result.hots);
          this.searchlist = response.data.result.hots;
          window.localStorage.setItem(
            " searchlist",
            JSON.stringify({
              val: this.searchlist,
              time: Date.now() + 1 * 60 * 60
            })
          );
          // console.log(this.hotlist);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    CheckLocal: function() {
      let cacheSearchlist = JSON.parse(
        window.localStorage.getItem("searchlist")
      );
      // console.log("created");
      if (cacheSearchlist && cacheSearchlist.time > Date.now()) {
        this.searchlist = cacheSearchlist.val;
      } else {
        this.getSearchList();
      }
    },
    searchsubmit: function(text) {
      this.showresult = true;
      for (var i = 0; i < this.searchhistory.length; i++) {
        if (text == this.searchhistory[i]) {
          this.searchhistory.splice(i, 1);
        }
      }
      this.searchhistory.unshift(text);
      this.getsearchresult(text);
      this.searchtext = text;
    },
    delsearchtext: function() {
      this.showresult = false;
      this.searchtext = "";
    },
    getSearchsuggest: function() {
      this.axios
        .get("/search/suggest", {
          params: {
            keywords: this.searchtext,
            type: "mobile"
          }
        })
        .then(response => {
          // console.log(response.data.result.allMatch);
          this.searchsuggest = response.data.result.allMatch;
          // console.log(this.hotlist);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getsearchresult: function(text) {
      this.axios
        .get("/search", {
          params: {
            keywords: text
          }
        })
        .then(response => {
          // console.log(response.data.result.songs);
          this.resultlist = response.data.result.songs;
          // console.log(this.hotlist);
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  },
  created() {
    this.CheckLocal();
  },
  watch: {
    searchtext: function() {
      this.getSearchsuggest();
    }
  }
};
</script>
<style lang="less" scoped>
.search {
  .searchinput {
    padding: 20px 0px;
    background: #fbfcfd;
    justify-content: center;
    span {
      height: 30px;
      flex-basis: 10%;
      border-radius: 30px;
      background: #ebecec;
      color: #d3d4d4;
      line-height: 30px;
      text-align: center;
      img {
        width: 13px;
        height: 13px;
        vertical-align: middle;
        margin-bottom: 2px;
      }
    }
    input {
      flex-basis: 80%;
      background: #ebecec;
      height: 30px;
      border: none;
      text-indent: 1.2em;
      outline: none;
      // z-index: 3;
    }
    span:first-child {
      position: relative;
      left: 15px;
      // z-index: 0;
      // background: skyblue;
    }
    span:last-child {
      position: relative;
      left: -15px;
    }
    display: flex;
    input::-webkit-input-placeholder {
      font-size: 14px;
      color: #d3d4d4;
    }
  }
  .hotsearch {
    border-top: 0.5px solid #eaebec;
    padding: 15px 0px;
    // height: 150px;
    // background: skyblue;
    h5 {
      font-size: 12px;
      color: #666;
      line-height: 12px;
      font-weight: 400;
    }
    .hotsearchtext {
      margin-left: 10px;
      span {
        padding: 0 14px;
        border: 0.5px solid #d3d4da;
        color: #333;
        font-size: 14px;
        margin-right: 8px;
        // margin-top: 10px;
        margin-top: 8px;
        border-radius: 25px;
        display: inline-block;
        height: 32px;
        line-height: 32px;
      }
    }
    .searchresult {
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 99;
      padding-top: 8px;
      padding-left: 10px;
      background: #fbfcfd;
      h5 {
      }
      .songdetail {
        display: flex;
        margin-left: 10px;
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
    }
  }
  .searchhistory {
    padding-top: 10px;
    li {
      display: flex;
      height: 45px;
      align-items: center;
      z-index: 44;
      line-height: 45px;
      justify-content: center;
      span {
        flex-basis: 10%;
        text-align: center;
        display: flex;
        img {
          width: 17px;
          height: 17px;
          vertical-align: middle;
          margin: auto;
        }
      }
      div {
        flex-basis: 90%;
        flex: 1;
        display: flex;
        border-bottom: 1px solid #f2f3f3;
        p {
          flex-basis: 90%;
          padding-right: 10px;
          font-size: 14px;
          color: #333;
        }
        span {
          text-align: center;
          flex-basis: 10%;
          img {
            width: 15px;
            height: 15px;
          }
        }
      }
    }
  }
  .hotsearch {
    position: relative;
    .searching {
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 66;
      height: 460px;
      background: #fbfcfd;
      h3 {
        color: #789ac1;
        padding: 10px 0px;
        margin-left: 10px;
        border-bottom: 0.5px solid #f2f3f3;
      }
      li {
        height: 45px;
        margin-left: 10px;
        display: flex;
        line-height: 45px;
        span {
          flex-basis: 10%;
          text-align: center;
          vertical-align: middle;
          img {
            width: 15px;
            height: 15px;
          }
        }
        p {
          flex-basis: 90%;
          padding-right: 10px;
          font-size: 15px;
          border-bottom: solid 0.5px #f2f3f3;
        }
      }
    }
  }
}
</style>
