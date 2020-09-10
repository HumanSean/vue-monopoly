<template>
  <div class="chatroom">
    <h1>聊 天 区 域</h1>
    <div class="msgbox" ref="msgbox">
      <div
        :class="{ me: msg.name === user.name }"
        v-for="msg in msgs"
        :key="msg.time"
      >
        <div class="info">
          <el-tag v-if="msg.name !== user.name" type="info" plain>
            {{ msg.name }}
          </el-tag>
          <span>{{ new Date(msg.time).toLocaleTimeString() }}</span>
          <el-tag v-if="msg.name === user.name" type="primary" plain>
            {{ msg.name }}
          </el-tag>
        </div>
        <div class="content">
          {{ msg.content }}
        </div>
      </div>
    </div>
    <div class="chat">
      <el-input v-model="text" @keydown.enter.native="sendMsg"></el-input>
      <el-button size="mini" type="primary" @click="sendMsg">发送</el-button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      text: ""
    };
  },
  computed: {
    ...mapState(["msgs", "user"])
  },
  methods: {
    sendMsg() {
      if (!this.text) return;
      // let msg;
      // if (this.editableTabsValue === "大厅") {
      // msg = {
      //   type: "message",
      //   userId: this.userId,
      //   username: this.username,
      //   content: this.text,
      //   time: new Date().getTime()
      // };
      // } else {
      //   msg = {
      //     type: "private",
      //     target: this.editableTabsValue,
      //     userId: this.userId,
      //     username: this.username,
      //     content: this.text,
      //     time: new Date().getTime()
      //   };
      // }
      // this.ws.send(JSON.stringify(msg));
      this.$ws.sendMsg(this.user, this.text, new Date().getTime());
      this.text = "";
    }
  },
  watch: {
    msgs() {
      this.$nextTick(() => {
        this.$refs.msgbox.lastElementChild.scrollIntoView({
          behavior: "smooth"
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.msgbox {
  & {
    height: calc(100% - 85px);
    overflow: auto;
    padding: 5px;
    scroll-behavior: smooth;
  }
  > div {
    margin-top: 5px;
  }
  > div.me {
    text-align: right;
  }
  .el-tag {
    padding: 0 5px;
    line-height: 20px;
    height: 20px;
  }
  .info span:not(.el-tag) {
    color: #aaa;
    font-size: 10px;
    margin: 5px;
  }
  .content {
    padding: 5px 10px;
    background: #f4f4f5;
    font-size: 13px;
    margin: 7px 0;
    display: inline-block;
    border-radius: 5px;
    max-width: 80%;
    word-break: break-all;
  }
  .me .content {
    background: #320f83;
    color: #fafafa;
  }
}
.chat {
  & {
    width: 100%;
    height: 33px;
    border-top: 1px solid #eaeaea;
    padding: 3px 0 0 3px;
    box-sizing: border-box;
  }
  .el-input {
    display: inline-block;
    width: 77%;
  }
  ::v-deep .el-input__inner {
    height: 28px;
  }
  button {
    float: right;
    margin-right: 5px;
    width: 20%;
  }
}
</style>
