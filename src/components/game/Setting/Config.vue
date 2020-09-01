<template>
  <div class="config">
    <h2 class="title">房间选项</h2>
    <el-form ref="form" :inline="true" :model="form" label-width="80px">
      <!-- <el-form-item label="禁止进入">
        <el-switch v-model="form.reject"></el-switch>
      </el-form-item>-->
      <br />
      <el-form-item label="玩家人数" class="short">
        <el-select v-model="form.player" @change="handlePlayerChange">
          <el-option label="1" :value="1"></el-option>
          <el-option label="2" :value="2"></el-option>
          <el-option label="3" :value="3"></el-option>
          <el-option label="4" :value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="电脑人数" class="short">
        <el-select v-model="form.npc" @change="handleNpcChange">
          <el-option
            label="0"
            :value="0"
            :disabled="form.player === 1"
          ></el-option>
          <el-option
            label="1"
            :value="1"
            :disabled="form.player > 3"
          ></el-option>
          <el-option
            label="2"
            :value="2"
            :disabled="form.player > 2"
          ></el-option>
          <el-option
            label="3"
            :value="3"
            :disabled="form.player > 1"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="起始金钱">
        <el-select v-model="form.money">
          <el-option label="5000" :value="5000"></el-option>
          <el-option label="10000" :value="10000"></el-option>
          <el-option label="15000" :value="15000"></el-option>
          <el-option label="20000" :value="20000"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="起始道具">
        <el-checkbox-group v-model="form.cards">
          <el-checkbox label="随心卡" name="type"></el-checkbox>
          <el-checkbox label="停留卡" name="type"></el-checkbox>
          <el-checkbox label="转向卡" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="地图选择">
        <el-select v-model="form.map">
          <el-option label="经典地图" value="classic"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="胜利条件">
        <el-select v-model="form.condition">
          <el-option label="所有其他玩家破产" value="traditional"></el-option>
          <el-option label="达到指定资产" value="goal"></el-option>
          <el-option label="指定天数资产最多" value="time"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="目标资产" v-if="form.condition === 'goal'">
        <el-select v-model="form.goal">
          <el-option label="50000" :value="50000"></el-option>
          <el-option label="80000" :value="80000"></el-option>
          <el-option label="100000" :value="100000"></el-option>
          <el-option label="120000" :value="120000"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="天数限制" v-if="form.condition === 'time'">
        <el-select v-model="form.day">
          <el-option label="60" :value="60"></el-option>
          <el-option label="90" :value="90"></el-option>
          <el-option label="120" :value="120"></el-option>
          <el-option label="150" :value="150"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="bottom">
      <el-button type="primary" @click="startGame">开始游戏</el-button>
      <el-button @click="reset">重置</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    checkReady: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      form: {
        // reject: false,
        player: 1,
        npc: 1,
        money: 10000,
        cards: ["停留卡"],
        map: "classic",
        condition: "traditional",
        goal: 100000,
        day: 90
      }
    };
  },
  methods: {
    handlePlayerChange(val) {
      if (this.form.npc + val > 4) {
        this.form.npc = 4 - val;
      }
      if (val === 1 && !this.form.npc) {
        this.form.npc = 1;
      }
      this.$emit("numChange", val, this.form.npc);
    },
    handleNpcChange(val) {
      this.$emit("numChange", this.form.player, val);
    },
    reset() {
      this.$confirm("是否重置当前房间选项?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "primary"
      })
        .then(() => {
          this.form = {
            //   reject: false,
            player: 1,
            npc: 1,
            money: 10000,
            cards: ["随心卡"],
            condition: "traditional",
            goal: 0,
            day: 0
          };
        })
        .catch(() => {});
    },
    startGame() {
      if (this.checkReady) {
        this.$emit("game-start", this.form);
      } else {
        this.$message.error({ message: "还有角色没选择好！", duration: 1000 });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.config {
  & {
    position: relative;
    float: right;
    width: 38.1%;
    height: calc(100% - 65px);
    border-left: 2px solid teal;
  }
  h2 {
    margin: 10px;
  }
  ::v-deep .el-form {
    .short .el-select .el-input {
      width: 60px;
    }
    .el-select .el-input {
      width: 210px;
    }
    .el-checkbox {
      margin-right: 9px;
    }
    .el-checkbox__label {
      padding-left: 3px;
    }
  }
  .bottom {
    position: absolute;
    width: 100%;
    bottom: 13px;
    text-align: center;
  }
}
</style>
