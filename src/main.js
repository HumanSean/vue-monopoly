import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "./styles.scss";
import ws from "./utils/ws";
import axios from "axios";
Vue.use(ElementUI);

Vue.prototype.$ws = ws;
Vue.prototype.$axios = axios;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
