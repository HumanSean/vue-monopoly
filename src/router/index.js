import Vue from "vue";
import VueRouter from "vue-router";
import Hall from "../views/Hall.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/game"
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
  mode: "history",
  base: "./game/vue-monopoly",
  routes
});

export default router;
