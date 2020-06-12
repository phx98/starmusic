import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Hot from "../views/Hot.vue";
import Search from "../views/Search.vue";
import Playlist from "../views/Playlist.vue";
import Mine from "../views/Mine.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import MinePlaylist from "../views/MinePlaylist.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: "/Register",
    name: "Register",
    component: Register
  },
  {
    path: "/Home",
    name: "Home",
    component: Home
  },
  {
    path: "/hot",
    name: "Hot",
    component: Hot
  },
  {
    path: "/search",
    name: "Search",
    component: Search
  },
  {
    path: '/Mine',
    name: 'Mine',
    component: Mine
  },
  {
    path: "/playlist",
    name: "Playlist",
    component: Playlist
  },
  {
    path:'/MinePlaylist',
    name:"MinePlaylist",
    component:MinePlaylist
  }
];

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
});
router.beforeEach((to, from, next) => {
  // console.log(to, from);
  // if(to.path ==)
  next();
  const nextRoute = ['Mine', 'Home', 'Hot', 'Playlist', 'Search']
  let cacheLogin = JSON.parse(
    window.localStorage.getItem('login')
  );
  // 登由录页面到home页面时
  if (to.name == 'Home' && from.name == 'Login') {
    // console.log('可以的');
    return;
  }
  // 不是登录页面时
  if (nextRoute.indexOf(to.name) >= 0 && !cacheLogin) {
    router.push({
      path: '/'
    })
  }

})

export default router;
