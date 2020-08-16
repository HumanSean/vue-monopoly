<template>
  <div class="game-log">
    <el-card>
      <div slot="header" class="clearfix">
        <span>游戏记录</span>
        <el-button style="float: right; padding: 4px 8px" @click="changeSpeed">
          {{ v === 800 ? "加速" : "正常" }}
        </el-button>
      </div>
      <div ref="msgs" class="msg" v-for="(msg, index) in gameLog" :key="index">
        {{ msg }}
      </div>
    </el-card>
  </div>
</template>

<script>
import { gameLog } from "../../../../utils/main";
export default {
  props: {
    v: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      gameLog: gameLog.logs
    };
  },
  methods: {
    changeSpeed() {
      let speed = this.v === 800 ? 300 : 800;
      this.$emit("change-speed", speed);
    }
  },
  watch: {
    gameLog() {
      this.$refs.msgs[this.$refs.msgs.length - 1].scrollIntoView({
        behavior: "smooth"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.game-log {
  & {
    width: 100%;
    height: calc(100% - 445px);
    box-sizing: border-box;
    padding: 10px;
  }
  .el-card {
    & {
      position: relative;
      height: 100%;
    }
    ::v-deep .el-card__header {
      padding: 10px;
    }
    ::v-deep .el-card__body {
      padding: 26px 13px;
      height: calc(100% - 40px);
      box-sizing: border-box;
      overflow: auto;

      .msg {
        font-size: 13px;
        padding: 3px;
      }
    }
  }
}
</style>
