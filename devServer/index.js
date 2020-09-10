const WebSocket = require("ws");
const express = require("express");
const app = express();
const config = {
  url: "mongodb://localhost:27017",
  dbName: "monopoly"
};
const { EventEmitter } = require("events");
const { MongoClient, ObjectId } = require("mongodb");

class Mongodb {
  constructor(config) {
    // 保存config
    this.config = config;
    this.emitter = new EventEmitter();
    // 连接
    this.client = new MongoClient(config.url, { useNewUrlParser: true });
    this.client.connect(err => {
      if (err) throw err;
      this.emitter.emit("connect");
    });
  }

  // 返回对应的集合
  col(colName, dbName = config.dbName) {
    return this.client.db(dbName).collection(colName);
  }
  // 订阅数据库连接
  once(event, cb) {
    this.emitter.once(event, cb);
  }
}

const mongodb = new Mongodb(config);
mongodb.once("connect", async () => {
  console.log("数据库连接成功！");
});

app.get("/api/users", async (req, res) => {
  const users = await mongodb
    .col("users")
    .find()
    .toArray();
  res.json({ status: 200, data: { users } });
});
app.get("/api/login", async (req, res) => {
  const user = await mongodb.col("users").findOne(req.query);
  res.json({ status: 200, data: { user } });
});
app.get("/api/add/user", async (req, res) => {
  await mongodb.col("users").insertOne(req.query);
  res.json({ status: 200, msg: "success" });
});
app.listen(8000);

// WebSocket
const wss = new WebSocket.Server({ port: 8001 });

const userMap = {};
const msgs = [];
let rooms = [];
function refreshRoom() {
  broadcast(
    JSON.stringify({
      type: "rooms",
      rooms
    })
  );
}
function leaveRoom(user) {
  let targetSeat;
  let targetRoom;
  rooms.forEach(room => {
    let seat = room.seats.find(seat => seat.user.name === user.name);
    if (seat) {
      targetRoom = room;
      targetSeat = seat;
    }
  });
  if (!targetSeat) return;
  targetSeat.user = null;
  targetSeat.state = "empty";
  if (targetRoom.seats.every(seat => !seat.user)) {
    rooms.splice(rooms.indexOf(targetRoom), 1);
  }
}
wss.on("connection", ws => {
  // 发送当前聊天列表
  ws.on("message", msg => {
    // 消息分发处理中心
    msg = JSON.parse(msg);
    let reply;
    switch (msg.type) {
      // 新用户连接
      case "connect":
        ws.user = msg.user;
        userMap[msg.user.name] = ws;
        mongodb
          .col("users")
          .updateOne({ name: msg.user.name }, { $set: { state: "online" } });
        msgs.push({
          name: "系统",
          content: msg.user.name + "上线了。",
          time: msg.time
        });
        reply = {
          type: "user-change",
          msgs,
          userMap
        };
        broadcast(JSON.stringify(reply));
        refreshRoom();
        break;
      case "message":
        msgs.push({
          name: msg.user.name,
          content: msg.content,
          time: msg.time
        });
        reply = {
          type: "message",
          msgs
        };
        broadcast(JSON.stringify(reply));
        break;
      case "private":
        notify([msg.userId, msg.target], JSON.stringify(reply));
        break;
      case "addRoom":
        rooms.push(msg.room);
        refreshRoom();
        break;
      case "enterRoom":
        var room = rooms.find(room => room.id === msg.id);
        var seat = room.seats.find(seat => seat.state === "empty");
        seat.user = msg.user;
        seat.state = "occupied";
        refreshRoom();
        break;
      default:
        break;
    }
  });
  ws.on("close", () => {
    delete userMap[ws.user.name];
    mongodb
      .col("users")
      .updateOne({ name: ws.user.name }, { $set: { state: "offline" } });
    // 退出房间
    leaveRoom(ws.user);
    refreshRoom();
    msgs.push({
      name: "系统",
      content: ws.user.name + "下线了。",
      time: new Date().getTime()
    });
    let reply = {
      type: "user-change",
      msgs,
      userMap
    };
    broadcast(JSON.stringify(reply));
  });
});

function notify(target, msg) {
  target.forEach(id => {
    userMap[id].send(msg);
  });
}

function broadcast(msg) {
  Object.keys(userMap).forEach(key => {
    const ws = userMap[key];
    ws.send(msg);
  });
}
