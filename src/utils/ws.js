import store from "../store/index";
const websocket = {
  sendMsg(user, content, time) {
    let msg = {
      type: "message",
      user,
      content,
      time
    };
    this.send(msg);
  },
  sendPrivateMsg(target, user, content, time) {
    let msg = {
      type: "private",
      target,
      user,
      content,
      time
    };
    this.send(msg);
  },
  addRoom(room) {
    let msg = {
      type: "addRoom",
      room
    };
    this.send(msg);
  },
  enterRoom(id, user) {
    let msg = {
      type: "enterRoom",
      id,
      user
    };
    this.send(msg);
  },
  send(msg) {
    store.state.ws.send(JSON.stringify(msg));
  }
};

export default websocket;
