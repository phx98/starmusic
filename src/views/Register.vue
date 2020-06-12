<template>
  <div class="register">
    <div class="registerlogo">
      <img src="../assets/musiclogo.svg" />
    </div>
    <div class="registerinput">
      <label for="username">
        <span>
          <img src="../assets/user.svg" alt />
        </span>
        <input type="text" v-model="userinfo.username" />
      </label>
      <label for="password">
        <span>
          <img src="../assets/password.svg" alt />
        </span>
        <input type="password" v-model="userinfo.password" />
      </label>
      <button @click="onsubmit">注册</button>
    </div>
    <transition
      name="custom-classes-transition"
      enter-active-class="animated bounceIn"
      leave-active-class="animated fadeOut"
    >
      <div class="errorprompt" v-if="showerrorprompt">注册失败,请重新注册</div>
    </transition>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      userinfo: {
        username: "",
        password: ""
      },
      showerrorprompt: false
    };
  },
  methods: {
    onsubmit() {
      this.$axios
        .get(this.apilist[0] + "/register", {
          params: {
            username: this.userinfo.username,
            password: this.userinfo.password
          }
        })
        .then(response => {
          // console.log(response);
          if (response.data == 200) {
            this.$router.push({
              path: "/"
            });
          } else {
            this.showerror();
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    showerror() {
      this.showerrorprompt = true;
      setInterval(() => {
        this.showerrorprompt = false;
      }, 3000);
    }
  }
};
</script>

<style lang="less" scoped>
.register {
  height: 100%;
  background: #42b983;
  position: relative;
  .registerlogo {
    text-align: center;
    padding-top: 100px;
    margin-bottom: 100px;
    img {
      width: 100px;
      height: 100px;
    }
  }
  .registerinput {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    label {
      flex-basis: 80%;
      margin-top: 15px;
      text-align: right;
      position: relative;
      display: flex;
      justify-content: center;
      span {
        font-weight: 600;
        background: rgba(255, 255, 255, 0.3);
        display: inline-block;
        height: 40px;
        width: 45px;
        border-top-left-radius: 18px;
        border-bottom-left-radius: 18px;
        img {
          width: 25px;
          height: 25px;
          margin-top: 5px;
        }
      }
      input {
        height: 40px;
        text-indent: 0.5em;
        font-size: 18px;
        width: 235px;
        outline: none;
        color: #fff;
        border: none;
        border-top-right-radius: 18px;
        border-bottom-right-radius: 18px;
        background: rgba(255, 255, 255, 0.3);
        border-left: none;
      }
    }
    button {
      // flex-basis: 70%;
      width: 280px;
      font-size: 18px;
      padding: 10px;
      margin-top: 50px;
      background: #fff;
      text-decoration: none;
      border: none;
      font-weight: 600;
      color: #333;
      border-radius: 20px;
      outline: none;
    }
  }
  .errorprompt {
    background: rgba(255, 255, 255, 0.4);
    padding: 10px;
    width: 200px;
    border-radius: 5px;
    text-align: center;
    color: #d7494d;
    font-size: 18px;
    font-weight: 600;
    position: absolute;
    top: 50px;
    left: calc(50% - 100px);
  }
}
</style>