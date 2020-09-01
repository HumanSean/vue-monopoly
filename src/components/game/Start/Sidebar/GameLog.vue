<template>
  <div class="game-log">
    <el-card>
      <div slot="header" class="clearfix">
        <span>游戏记录</span>
        <el-tag v-if="activePlayer" type="info">
          第{{ activePlayer.map.day }}天
        </el-tag>

        <el-popover
          popper-class="center"
          placement="bottom"
          width="150"
          trigger="hover"
        >
          <div>
            <span v-if="activePlayer && activePlayer.map.goal">
              达到目标资产：${{ activePlayer.map.goal }}
            </span>
            <span v-else-if="activePlayer && activePlayer.map.dayLimit">
              目标天数资产最多：{{ activePlayer.map.dayLimit }}天
            </span>
            <span v-else>所有其他玩家破产</span>
          </div>
          <el-tag slot="reference" type="success">
            胜利条件
          </el-tag>
        </el-popover>

        <el-button style="float: right; padding: 4px 8px" @click="changeSpeed">
          {{ v === 800 ? "正常" : "加速" }}
        </el-button>
      </div>
      <div>
        <div
          ref="msgs"
          class="msg"
          v-for="(msg, index) in gameConsole"
          :key="index"
          v-html="msg"
        ></div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { gameConsole } from "../../../../utils/main";
export default {
  props: {
    activePlayer: {
      required: true
    },
    v: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      gameConsole: gameConsole.logs
    };
  },
  methods: {
    changeSpeed() {
      let speed = this.v === 800 ? 300 : 800;
      this.$emit("change-speed", speed);
    }
  },
  watch: {
    gameConsole() {
      this.$nextTick(() => {
        this.$refs.msgs[this.$refs.msgs.length - 1].scrollIntoView({
          behavior: "smooth"
        });
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
  .el-tag {
    padding: 0 5px;
    height: 20px;
    line-height: 18px;
    margin-left: 10px;
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
      padding: 10px;
      height: calc(100% - 40px);
      box-sizing: border-box;
      overflow: auto;

      .msg {
        font-size: 13px;
        padding: 3px;
        margin-bottom: 5px;
      }
    }
  }
}
</style>
