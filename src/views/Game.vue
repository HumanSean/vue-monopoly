<template>
  <div class="game">
    <Setting v-if="gameStarted" @game-start="gameStart" />
    <GameArea v-else :config="config" :chrs="chrs" />
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
      gameStarted: false,
      config: {
        // reject: false,
        player: 1,
        npc: 1,
        money: 10000,
        cards: ["随心卡"],
        map: "classic",
        condition: "traditional",
        goal: 100000,
        day: 90
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
          control: 1
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
.game {
  width: 100%;
  height: 100%;
}
</style>
