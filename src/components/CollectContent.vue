<template>
  <div class="collectcontent">
    <div class="one" v-for="(item,index) in playlist" :key="index" @click="Toplaylist(item.id)">
      <div class="playlistimg">
        <img :src="item.coverImgUrl" alt />
      </div>
      <div class="collectright">
        <h3>{{item.name}}</h3>
        <p>{{item.trackCount}}首</p>
      </div>
    </div>
    <div class="end" @click="$emit('show-add')">
      <div class="add">
        <img src="../assets/addplaylist.svg" alt />
      </div>
      <h4>创建歌单</h4>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    playlist: Array
  },
  data: function() {
    return {
      playlistname: ""
    };
  },
  methods: {
    Toplaylist: function(id) {
      this.$router.push({
        path: "MinePlaylist",
        query: {
          playlistid: id
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.collectcontent {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  .one {
    flex-basis: 50%;
    display: flex;
    padding: 5px 0px;
    .playlistimg {
      // flex-basis: 30%;
      height: 50px;
      border-radius: 5px;
      overflow: hidden;
      margin-left: 20px;
      img {
        height: 50px;
        vertical-align: middle;
      }
    }
    .collectright {
      margin-left: 20px;
      text-align: left;
      h3 {
        font-size: 16px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 80px;
      }
      p {
        color: #666;
        margin-top: 8px;
        font-size: 14px;
      }
    }
  }
  .end {
    display: flex;
    padding: 5px 0px;
    flex-basis: 50%;
    .add {
      background: #e0e0e0;
      height: 50px;
      width: 50px;
      border-radius: 5px;
      margin-left: 20px;
      img {
        width: 50%;
        margin-top: 12px;
      }
    }
    h4 {
      margin-left: 20px;
      font-size: 16px;
      margin-top: 12px;
    }
  }
}
</style>