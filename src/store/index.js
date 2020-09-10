import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // config: {},
    // players: [],
    // map: [],
    // v: 800,
    user: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null,
    ws: null,
    userMap: {},
    msgs: [],
    rooms: []
  },
  getters: {
    users: state => {
      let arr = Object.keys(state.userMap);
      if (!arr.length) return [];
      let users = [];
      arr.forEach(key => {
        let ws = state.userMap[key];
        users.push(ws.user);
      });
      return users;
    }
  },
  mutations: {
    setUser(state) {
      state.user = JSON.parse(localStorage.getItem("user"));
    },
    setWs(state, ws) {
      state.ws = ws;
    },
    setUserMap(state, userMap) {
      state.userMap = userMap;
    },
    setMsgs(state, msgs) {
      state.msgs = msgs;
    },
    setRooms(state, rooms) {
      state.rooms = rooms;
    }
    // setConfig(state, config) {
    //   state.config = config;
    // },
    // setPlayers(state, players) {
    //   state.players = players;
    // }
  },
  actions: {
    setWs({ commit, state }, ws) {
      ws.onopen = () => {
        // 连接事件
        let currentTime = new Date().getTime();
        let msg = {
          type: "connect",
          user: state.user,
          time: currentTime
        };
        ws.send(JSON.stringify(msg));
      };
      ws.onmessage = msg => {
        // 消息集散中心
        const reply = JSON.parse(msg.data);
        switch (reply.type) {
          case "user-change":
            commit("setUserMap", reply.userMap);
            commit("setMsgs", reply.msgs);
            break;
          case "message":
            commit("setMsgs", reply.msgs);
            break;
          case "private":
            // 收到消息
            // if (reply.to === state.userId) {
            //     if (!this.privateMsgs[reply.from]) {
            //         this.$set(this.privateMsgs, reply.from, []);
            //     }
            //     this.privateMsgs[reply.from].push(reply.msg);
            // }
            break;
          case "rooms":
            commit("setRooms", reply.rooms);
            break;
          default:
            break;
        }
      };
      commit("setWs", ws);
    }
  },
  modules: {}
});
