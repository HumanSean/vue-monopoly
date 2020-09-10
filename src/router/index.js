import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Hall from "../views/Hall.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Home
    // redirect: "/game"
  },
  {
    path: "/hall",
    name: "Hall",
    component: Hall
  },
  {
    path: "/room",
    name: "Room",
    component: () => import("../views/Room.vue")
  },
  {
    path: "/game",
    name: "Game",
    component: () => import("../views/Game.vue")
  }
];

const router = new VueRouter({
  mode: "hash",
  routes
});

export default router;
