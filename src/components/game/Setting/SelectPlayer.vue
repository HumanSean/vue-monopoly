<template>
  <div class="select-player">
    <div class="grid">
      <div class="card" v-for="c in characters" :key="c.name">
        <el-card :body-style="{ padding: '0px' }">
          <h2>{{ c.chr || "未选择角色" }}</h2>
          <img :src="imgs[c.chr]" />
          <div>
            <el-button-group>
              <el-button
                type="primary"
                icon="el-icon-user-solid"
                size="small"
                @click="chooseChr(c)"
              ></el-button>
            </el-button-group>
            <h3>{{ c.name }}</h3>
          </div>
        </el-card>
      </div>
    </div>
    <!-- 角色选择框 -->
    <el-dialog
      :visible.sync="characterBox"
      width="800px"
      :show-close="false"
      :append-to-body="true"
    >
      <div class="chr">
        <div class="img" v-for="chr in filteredChrs" :key="chr">
          <img :src="imgs[chr]" alt @click="select(chr)" />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    characters: {
      type: Array,
      default: () => []
    },
    selectedChrs: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      characterBox: false,
      selectedChr: null,
      selected: "",
      chrs: [
        "Aquaman",
        "Batgirl",
        "Batman",
        "Batwoman",
        "Black Canary",
        "Brainiac",
        "Captain Cold",
        "Catwoman",
        "Cyborg",
        "Deadshot",
        "Deathstroke",
        "Firestorm",
        "Flash",
        "General Zod",
        "Green Arrow",
        "Green Lantern",
        "Harley Quinn",
        "Joker",
        "Killer Frost",
        "Lex Luthor",
        "Martian Manhunter",
        "Nightwing",
        "Penguin",
        "Poison Ivy",
        "Red Hood",
        "Reverse Flash",
        "Robin",
        "Starfire",
        "Supergirl",
        "Superman",
        "Two Face",
        "Wonder Woman"
      ]
    };
  },
  methods: {
    chooseChr(chr) {
      this.characterBox = true;
      this.selectedChr = chr;
    },
    select(chr) {
      this.$emit("choose", this.selectedChr, chr);
      this.selectedChr = null;

      this.characterBox = false;
    }
  },
  computed: {
    imgs() {
      let obj = {};
      this.chrs.forEach(name => {
        obj[name] = require(`../../../assets/${name}.png`);
      });
      return obj;
    },
    filteredChrs() {
      return this.chrs.filter(name => this.selectedChrs.indexOf(name) === -1);
    }
  }
};
</script>

<style lang="scss" scoped>
.select-player {
  & {
    width: 61.8%;
    height: calc(100% - 65px);
  }
  .grid {
    & {
      display: grid;
      grid-template-columns: repeat(2, 50%);
      height: 100%;
      justify-items: center;
      align-items: center;
      padding: 0 13px;
    }
    .card {
      & {
        position: relative;
        width: 180px;
        border: 2px solid teal;
        border-radius: 5px;
      }
      img {
        position: relative;
        width: 180px;
        height: 180px;
        transform: scale(0.7) translateY(30px);
      }

      h2 {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        text-align: center;
        border-bottom: 1px solid #aaa;
        font-size: 15px;
        padding: 7px;
        box-sizing: border-box;
      }

      h3 {
        float: right;
        margin-right: 7px;
        height: 30px;
        line-height: 30px;
      }
    }
  }
}
::v-deep .el-dialog__body {
  padding: 13px;
}
.chr {
  & {
    width: 100%;
    height: 400px;
    display: grid;
    grid-template-columns: repeat(8, 1fr);
  }
  img {
    width: 90%;
  }
  img:hover {
    cursor: pointer;
    transform: scale(1.1);
    transition: 0.1s;
  }
}
</style>
