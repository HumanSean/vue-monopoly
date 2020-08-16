<template>
  <div class="game-area">
    <Map ref="map" />
    <div class="sidebar">
      <GameLog :v="v" @change-speed="changeSpeed" />
      <PlayerInfo :players="players" />
      <PlayArea :active-player="activePlayer" @move="playerMove" :v="v" />
    </div>
  </div>
</template>

<script>
import { Player, Boxes } from "../../../utils/main";
import { characters, maps, seq } from "../../../utils/data";
import Map from "./Map.vue";
import PlayerInfo from "./Sidebar/PlayerInfo.vue";
import PlayArea from "./Sidebar/PlayArea.vue";
import GameLog from "./Sidebar/GameLog.vue";

export default {
  components: {
    Map,
    PlayerInfo,
    PlayArea,
    GameLog
  },
  props: {
    // 在这里注入所有初始化数据
    config: {
      type: Object,
      required: true
    },
    chrs: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      // 此处管理所有数据
      v: 300,
      map: [],
      players: []
    };
  },
  computed: {
    activePlayer() {
      return this.players.find(player => player.cur);
    }
  },
  methods: {
    changeSpeed(v) {
      this.v = v;
    },
    playerMove(player, steps) {
      player.move(steps, this.map, this.v);
    }
  },
  created() {},
  mounted() {
    // 创建地图
    let map = maps[this.config.map];
    let boxes = this.$refs.map.$refs.boxes;
    this.map = map.map((boxConfig, index) => {
      let Box;
      switch (boxConfig.type) {
        case "land":
          Box = Boxes.LandBox;
          break;
        case "fate":
          Box = Boxes.FateBox;
          break;
        case "chance":
          Box = Boxes.ChanceBox;
          break;
        case "jail":
          Box = Boxes.JailBox;
          break;
        case "hospital":
          Box = Boxes.HospitalBox;
          break;
        case "good":
          Box = Boxes.GoodBox;
          break;
        case "bad":
          Box = Boxes.BadBox;
          break;
        case "air":
          Box = Boxes.AirportBox;
          break;
        case "card":
          Box = Boxes.CardBox;
          break;
        default:
          Box = Boxes.Box;
          break;
      }
      let box = new Box({
        ...boxConfig,
        node: boxes[seq[index]]
      });
      // 地产格子着色
      if (box.bg) {
        let title = document.createElement("h2");
        title.innerHTML = box.name;
        title.style.background = box.bg;
        box.node.append(title);
      }
      // 非地产格子有图片
      if (box.src) {
        let title = document.createElement("h3");
        title.innerHTML = box.name;
        let img = document.createElement("img");
        img.className = "bg";
        img.src = require(`../../../assets/${box.src}.png`);
        box.node.append(title);
        box.node.append(img);
      }
      return box;
    });
    // 创建角色
    const { money, cards } = this.config;
    this.players = this.chrs.map((chr, index) => {
      let node = document.createElement("img");
      node.src = require(`../../../assets/${chr.chr}.png`);
      node.style.zIndex = "1";
      node.className = "chr";
      let player = new Player({
        ...chr, // name, chr(name), control
        color: characters[chr.chr].color,
        money,
        salary: 2000,
        state: "active",
        luck: 0.5,
        stop: 0,
        cur: false,
        next: null,
        node,
        position: 0,
        direction: 0,
        cards,
        lands: [],
        map: this.map
      });
      if (!index) player.cur = true;
      player.initiate(this.map);
      return player;
    });
    // 绑定下一位玩家
    for (let i = 0; i < this.players.length; i++) {
      const player = this.players[i];
      if (i === this.players.length - 1) {
        player.next = this.players[0];
      } else {
        player.next = this.players[i + 1];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.game-area {
  & {
    width: 100%;
    height: 100%;
  }
  .sidebar {
    position: absolute;
    top: 0;
    right: 0;
    width: 300px;
    height: 100%;
    overflow: hidden;
  }
}
</style>
