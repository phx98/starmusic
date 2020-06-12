<template>
  <li class="singplaylist" @click="$emit('translate-song', songidentity)">
    <div class="titleleft">
      <template v-if="songplaying">
        <img src="../assets/playing.svg" alt />
      </template>
      <span>{{song.name}}</span>
      <span>-{{song.ar[0].name}}</span>
    </div>
    <div class="titleright">
      <img src="../assets/delete1.svg" @click.stop="$emit('delete-playlist', song.id)" />
    </div>
  </li>
</template>

<script>
export default {
  data: function() {
    return {
      songplaying: false
    };
  },
  props: {
    song: Object,
    songid: Number
  },
  mounted() {
    if (this.songindex == this.song.id) {
      this.songplaying = true;
    }
  },
  computed: {
    songindex: function() {
      return this.songid;
    },
    songidentity:function () {
      return this.song.id;
    }
  },
  watch: {
    songindex: function() {
      // console.log("有所变化");
      if (this.songindex == this.song.id) {
        this.songplaying = true;
      } else {
        this.songplaying = false;
      }
    }
  }
};
</script>

<style lang="less">
.singplaylist {
  margin: 15px 0px;
  display: flex;
  .titleleft {
    font-size: 16px;
    flex-basis: 60%;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    display: -webkit-box;
    span:last-child {
      font-size: 12px;
      font-weight: 400;
      color: #ccc;
    }
    img {
      width: 15px;
      height: 15px;
    }
  }
  .titleright {
    text-align: right;
    // background: skyblue;
    margin-left: 30%;
    flex-basis: 10%;
    img {
      width: 18px;
      height: 18px;
    }
  }
}
</style>