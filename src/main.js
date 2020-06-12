import Vue from "vue";
import "./plugins/axios";
import axios from "axios";
import App from "./App.vue";
import router from "./router";
import { Lazyload } from 'vant';

Vue.use(Lazyload,{
  lazyComponent: true,
});
Vue.config.productionTip = false;
Vue.prototype.apilist = [
  "http://127.0.0.1:3000"
]
Vue.prototype._$axios = axios;
new Vue({
  router,
  render: h => h(App)
}).$mount("#app");

