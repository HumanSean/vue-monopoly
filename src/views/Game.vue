<template>
  <div class="game">
    <div class="container" v-if="isPc">
      <Setting v-if="!gameStarted" @game-start="gameStart" />
      <GameArea v-else :config="config" :chrs="chrs" />
    </div>
    <div v-else>请用电脑版的Chrome打开</div>
  </div>
</template>

<script>
import Setting from "@/components/game/Setting/Setting.vue";
import GameArea from "@/components/game/Start/GameArea.vue";

export default {
  components: {
    Setting,
    GameArea
  },
  data() {
    return {
      isPc: window.innerWidth > 888,
      gameStarted: false,
      config: {
        // reject: false,
        player: 1,
        npc: 1,
        money: 10000,
        cards: [
          "停留卡",
          "转向卡",
          "幸运卡",
          "工资卡",
          "加薪卡",
          "爆破卡",
          "升级卡",
          "降级卡",
          "买地卡",
          "卖地卡",
          "查税卡",
          "抢劫卡",
          "坐牢卡",
          "住院卡",
          "霉运卡",
          "随心卡"
        ],
        map: "classic",
        condition: "traditional",
        goal: 12000,
        day: 3
      },
      chrs: [
        {
          name: "玩家1",
          chr: "Wonder Woman",
          control: 1
        },
        {
          name: "玩家2",
          chr: "Batgirl",
          control: 0
        }
      ]
    };
  },
  methods: {
    gameStart(config, chrs) {
      this.config = config;
      this.chrs = chrs;
      this.gameStarted = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.game,
.container {
  width: 100%;
  height: 100%;
}
</style>
