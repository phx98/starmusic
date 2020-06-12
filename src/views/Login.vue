<template>
  <div class="login">
    <div class="loginlogo">
      <img src="../assets/musiclogo.svg" />
    </div>
    <div class="logininput">
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
      <button @click="onsubmit">登录</button>
      <p class="toRegister">
        <span>忘记密码</span>
        <router-link to="/Register">
          <p>前往注册>></p>
        </router-link>
      </p>
    </div>
    <Buffer v-if="showloginloading">正在前往登录页面</Buffer>
    <transition
      name="custom-classes-transition"
      enter-active-class="animated bounceIn"
      leave-active-class="animated fadeOut"
    >
      <div class="errorprompt" v-if="showerrorprompt">登录失败,请重新登录</div>
    </transition>
  </div>
</template>

<script>
import Buffer from "@/components/Buffer.vue";
export default {
  components: {
    Buffer
  },
  data: function() {
    return {
      userinfo: {
        username: "",
        password: ""
      },
      showerrorprompt: false,
      showloginloading: false
    };
  },
  methods: {
    onsubmit() {
      this.$axios
        .get(this.apilist[0] + "/login", {
          params: {
            username: this.userinfo.username,
            password: this.userinfo.password
          }
        })
        .then(response => {
          if (response.data == 200) {
            this.$router.push({
              path: "/Home"
            });
            this.$emit("login-use", this.userinfo);
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
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$emit("empty-currentsng");
      vm.showloginloading = true;
      setInterval(() => {
        vm.showloginloading = false;
      }, 2000);
    });
  }
};
</script>

<style lang="less" scoped>
.login {
  height: 100%;
  background: #42b983;
  position: relative;
  .loginlogo {
    text-align: center;
    padding-top: 100px;
    margin-bottom: 100px;
    img {
      width: 100px;
      height: 100px;
    }
  }
  .logininput {
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
    .toRegister {
      margin-top: 20px;
      font-size: 18px;
      color: #fff;
      flex-basis: 100%;
      padding-left: 60px;
      position: relative;
      span:first-child {
        text-align: left;
      }
      p {
        position: absolute;
        top: 0;
        right: 40px;
        color: #fff;
      }
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