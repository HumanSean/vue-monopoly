<template>
  <div class="play-area">
    <h2 :style="{ background: activeColor }">
      {{ activePlayer && activePlayer.chr }}
    </h2>
    <div class="control">
      <div class="dice">
        <img :src="diceImg" alt />
      </div>
      <div class="btn">
        <el-button
          type="primary"
          @click="roll"
          :disabled="moved"
          :style="{ background: activeColor }"
        >
          掷骰子
        </el-button>
        <br />
        <el-button
          type="primary"
          :disabled="moved"
          :style="{ background: activeColor }"
        >
          使用道具
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
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
      activeColor: "#aaa",
      moved: false,
      diceImg: require(`../../../../assets/5.jpg`),
      diceImgs: Array(6)
        .fill()
        .map((v, i) => require(`../../../../assets/${i + 1}.jpg`)),
      diceRollImgs: Array(2)
        .fill()
        .map((v, i) => require(`../../../../assets/s${i + 1}.jpg`))
    };
  },
  watch: {
    activePlayer(n) {
      this.moved = !!n.stop;
      this.activeColor = n.color;
    }
  },
  methods: {
    roll() {
      this.moved = true;
      this.diceImg = this.diceRollImgs[Math.floor(Math.random() * 2)];
      setTimeout(() => {
        let num = Math.ceil(Math.random() * 6);
        this.diceImg = this.diceImgs[num - 1];
        setTimeout(() => {
          this.$emit("move", this.activePlayer, num);
        }, this.v);
      }, 300);
    }
  }
};
</script>

<style lang="scss" scoped>
.play-area {
  & {
    padding: 10px;
    height: 180px;
    box-sizing: border-box;
  }
  h2 {
    position: relative;
    display: inline-block;
    left: 54%;
    transform: translateX(-50%);
    margin-bottom: 5px;
    padding: 5px 13px;
    border-radius: 5px;
    color: #fafafa;
    min-width: 175px;
    text-align: center;
  }
  .control {
    & {
      text-align: center;
    }
    .dice {
      & {
        display: inline-block;
      }
      img {
        width: 100px;
        height: 100px;
      }
    }
    .btn {
      & {
        display: inline-block;
        position: relative;
        top: -25px;
        left: 10px;
      }
      button {
        width: 100px;
        padding: 10px;
        margin-bottom: 8px;
        border: none;
      }
    }
  }
}
</style>
