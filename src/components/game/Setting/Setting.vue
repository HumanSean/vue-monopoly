<template>
  <div class="setting">
    <h2>Vue 大 富 翁</h2>
    <Config
      @numChange="toggleCharacters"
      :check-ready="checkReady"
      @game-start="gameStart"
    />
    <SelectPlayer
      :characters="characters"
      :selected-chrs="selectedChrs"
      @choose="chooseChr"
    />
  </div>
</template>

<script>
import Config from "./Config.vue";
import SelectPlayer from "./SelectPlayer.vue";
export default {
  components: {
    Config,
    SelectPlayer
  },
  data() {
    return {
      characters: [
        {
          name: "玩家1",
          chr: "",
          control: 1
        },
        {
          name: "电脑1",
          chr: "",
          control: 0
        }
      ]
    };
  },
  methods: {
    // 游戏前设定相关
    toggleCharacters(player, npc) {
      let oldVal = this.characters.length;
      let newVal = player + npc;
      let amount = Math.abs(oldVal - newVal);
      if (newVal > oldVal) {
        for (let i = 0; i < amount; i++) {
          this.characters.push({
            control: 0,
            name: "",
            chr: ""
          });
        }
        this.writeName(player);
      } else if (newVal < oldVal) {
        for (let i = 0; i < amount; i++) {
          this.characters.pop();
        }
        this.writeName(player);
      } else {
        this.writeName(player);
      }
    },
    writeName(player) {
      let x = 0;
      for (let i = 0; i < this.characters.length; i++) {
        if (i < player) {
          this.characters[i].name = "玩家" + (i + 1);
          this.characters[i].control = 1;
        } else {
          this.characters[i].name = "电脑" + ++x;
          this.characters[i].control = 0;
        }
      }
    },
    chooseChr(chr, name) {
      let index = this.characters.indexOf(chr);
      this.characters[index].chr = name;
    },
    gameStart(config) {
      this.$emit("game-start", config, this.characters);
    }
  },
  computed: {
    selectedChrs() {
      return this.characters.map(chr => chr.chr);
    },
    checkReady() {
      return this.characters.every(chr => chr.chr);
    }
  }
};
</script>

<style lang="scss" scoped>
.setting {
  & {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 800px;
    height: 600px;
    border: 2px solid teal;
    border-radius: 5px;
  }
  h2 {
    padding: 13px;
    box-sizing: border-box;
    background: teal;
    color: #fafafa;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    height: 65px;
    font-size: 26px;
  }
}
</style>
