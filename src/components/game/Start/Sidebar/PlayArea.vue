<template>
  <div class="play-area">
    <!-- 当前回合玩家 -->
    <h2 :style="{ background: activeColor }">
      {{ activePlayer && activePlayer.chr }}
    </h2>
    <!-- 操作区 -->
    <div class="control">
      <div class="dice">
        <img :src="diceImg" alt />
      </div>
      <div class="btn">
        <el-button
          type="primary"
          @click="roll"
          :disabled="moved"
          :style="{
            background: activeColor,
            filter: moved ? 'grayscale(1)' : ''
          }"
          >掷骰子</el-button
        >
        <br />
        <el-button
          type="primary"
          @click="showItems"
          :disabled="moved"
          :style="{
            background: activeColor,
            filter: moved ? 'grayscale(1)' : ''
          }"
          >使用道具</el-button
        >
      </div>
    </div>
    <el-dialog title="道具栏" :visible.sync="dialogVisible" width="800px">
      <div class="grid" v-if="activePlayer">
        <el-popover
          placement="top-start"
          width="200"
          trigger="hover"
          v-for="(card, index) in activePlayer.cards"
          :key="index"
        >
          {{ card.detail }}
          <div
            class="box"
            :class="{ ban: card.checkBan && card.checkBan(activePlayer) }"
            @click="useItem(card)"
            slot="reference"
          >
            <div>
              <img :src="cardImgs[card.src]" alt />
              <h4>{{ card.name }}</h4>
            </div>
          </div>
        </el-popover>
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">返 回</el-button>
      </div>
    </el-dialog>
    <el-dialog title="请选择角色" :visible.sync="chrDialog" width="400px">
      <div class="grid chr">
        <div
          class="box"
          :class="{ ban: disablePlayer && player.state !== 'active' }"
          v-for="(player, index) in otherPlayers"
          :key="index"
          @click="selectedPlayer = player"
          :style="{
            borderColor: selectedPlayer === player ? 'teal' : '#454545'
          }"
        >
          <div>
            <img :src="require(`../../../../assets/${player.chr}.png`)" alt />
            <h4>{{ player.chr }}</h4>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button
          @click="
            chrDialog = false;
            selectedPlayer = null;
          "
          >返 回</el-button
        >
        <el-button @click="useChrItem(card)" :disabled="selectedPlayer === null"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog title="请选择点数" :visible.sync="diceDialog" width="800px">
      <div class="grid">
        <div
          class="box"
          v-for="i in 6"
          :key="i"
          @click="selectedDice = i"
          :style="{
            borderColor: selectedDice === i ? 'teal' : '#454545'
          }"
        >
          <div>
            <img :src="require(`../../../../assets/${i}.jpg`)" alt />
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button
          @click="
            diceDialog = false;
            selectedDice = 0;
          "
          >返 回</el-button
        >
        <el-button @click="useDiceItem(card)" :disabled="!selectedDice"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    activePlayer: {
      required: true
    },
    players: {
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
        .map((v, i) => require(`../../../../assets/s${i + 1}.jpg`)),
      dialogVisible: false,
      cardNames: [
        "stop",
        "turn",
        "salary",
        "dice",
        "tax",
        "substitute",
        "sell",
        "buy",
        "explosion",
        "badluck",
        "goodluck",
        "bomb",
        "ambulance",
        "police",
        "luck",
        "promotion",
        "roadblock",
        "rob",
        "upgrade",
        "downgrade"
      ],
      card: null,
      chrDialog: false,
      selectedPlayer: null,
      disablePlayer: false,
      diceDialog: false,
      selectedDice: 0
    };
  },
  computed: {
    cardImgs() {
      let obj = {};
      this.cardNames.forEach(name => {
        obj[name] = require(`../../../../assets/cards/${name}.png`);
      });
      return obj;
    },
    otherPlayers() {
      let arr = [...this.players];
      arr.splice(arr.indexOf(this.activePlayer), 1);
      return arr;
    },
    otherActivePlayers() {
      let arr = [...this.players];
      arr.splice(arr.indexOf(this.activePlayer), 1);
      arr.sort((a, b) => b.money - a.money);
      return arr.filter(player => player.state === "active");
    }
  },
  watch: {
    activePlayer(player) {
      this.activeColor = player.color;

      if (player.state !== "active") {
        this.moved = true;
      } else {
        // 解锁下名玩家
        this.moved = false;

        // 电脑逻辑
        if (!player.control) {
          this.moved = true;
          if (player.cards.length) {
            if (Math.random() > 0.4) {
              // 使用道具
              let result = player.useCard(this.otherActivePlayers);
              if (result === "moved") {
                // 移动过了
              } else if (result) {
                // 使用失败
                this.roll();
              } else {
                setTimeout(() => {
                  this.roll();
                }, 1000);
              }
            } else {
              this.roll();
            }
          } else {
            // 掷骰子
            this.roll();
          }
        }
      }
    }
  },
  methods: {
    roll() {
      this.moved = true;
      this.diceImg = this.diceRollImgs[Math.floor(Math.random() * 2)];
      setTimeout(() => {
        let num;
        if (this.activePlayer.diceNum) {
          num = this.activePlayer.diceNum;
          this.activePlayer.diceNum = 0;
        } else {
          num = Math.ceil(Math.random() * 6);
        }
        this.diceImg = this.diceImgs[num - 1];
        setTimeout(() => {
          this.$emit("move", this.activePlayer, num);
        }, this.v);
      }, 300);
    },
    showItems() {
      this.dialogVisible = true;
    },
    useItem(card) {
      if (card.type === "normal") {
        this.useNormalItem(card);
      } else if (card.type === "chr") {
        this.chrDialog = true;
        this.card = card;
      } else {
        this.diceDialog = true;
        this.card = card;
      }
    },
    useNormalItem(card) {
      let msg = `请问确定要使用${card.name}吗？`;
      if (card.checkMoney) {
        if (!card.checkMoney(this.activePlayer)) {
          this.$message("金钱不足，无法购买！");
          return;
        } else {
          msg = card.checkMoney(this.activePlayer);
        }
      }
      this.$confirm(msg, "使用道具")
        .then(() => {
          if (card.move) {
            this.moved = true;
          }
          this.activePlayer.cards.splice(
            this.activePlayer.cards.indexOf(card),
            1
          );
          card.activate(this.activePlayer);
          this.dialogVisible = false;
        })
        .catch(() => {});
    },
    useChrItem(card) {
      if (card.check) {
        this.disablePlayer = true;
      } else {
        this.disablePlayer = false;
      }
      if (card.move) {
        this.moved = true;
      }
      this.activePlayer.cards.splice(this.activePlayer.cards.indexOf(card), 1);
      card.activate(this.selectedPlayer, this.activePlayer);
      this.chrDialog = false;
      this.dialogVisible = false;
      this.selectedPlayer = null;
      this.card = null;
    },
    useDiceItem(card) {
      this.activePlayer.cards.splice(this.activePlayer.cards.indexOf(card), 1);
      card.activate(this.activePlayer, this.selectedDice);
      this.diceDialog = false;
      this.dialogVisible = false;
      this.selectedDice = 0;
      this.card = null;
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
  .grid {
    & {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      justify-items: center;
      row-gap: 26px;
    }
    &.chr {
      grid-template-columns: repeat(3, 1fr);
      .box {
        height: 130px;
      }
    }
    .box {
      & {
        position: relative;
        width: 100px;
        height: 120px;
        box-sizing: border-box;
        border-radius: 8px;
        border: 3px solid #454545;
        cursor: pointer;
      }
      &.ban {
        cursor: not-allowed;
        pointer-events: none;
        filter: grayscale(1);
      }
      > div {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
      }
      img {
        position: relative;
        width: 80%;
        left: 10%;
      }
      h4 {
        text-align: center;
        color: #454545;
      }
    }
  }
}
</style>
