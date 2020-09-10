<template>
  <div class="player-info">
    <!-- 当前屏幕的主玩家 -->
    <el-popover
      placement="right"
      width="260"
      trigger="hover"
      popper-class="player-info"
    >
      <el-form v-if="players[0]" label-width="50px" label-position="left">
        <el-form-item class="fixed" label="昵称">
          {{ players[0].name }}
        </el-form-item>
        <el-form-item class="fixed" label="角色">
          {{ players[0].chr }}
        </el-form-item>
        <el-form-item class="fixed" label="现金">
          ${{ players[0].money }}
        </el-form-item>
        <el-form-item class="fixed" label="资产">
          ${{ calTotal(players[0]) }}
        </el-form-item>
        <el-form-item class="fixed" label="薪水">
          ${{ players[0].salary }}
        </el-form-item>
        <el-form-item class="fixed" label="状态">
          {{ stateMap[players[0].state] }}
        </el-form-item>
        <el-form-item class="fixed" label="幸运">
          {{ players[0].luck * 100 }}%
        </el-form-item>
        <el-form-item class="fixed" label="方向">
          {{ directionMap[players[0].direction] }}
        </el-form-item>
        <el-form-item label="道具">
          <template v-if="players[0].cards.length">
            {{ players[0].cards.map(card => card.name).join(" | ") }}
          </template>
          <template v-else>空空如也</template>
        </el-form-item>
        <el-form-item label="地产">
          <template v-if="players[0].lands.length">
            {{ players[0].lands.map(land => land.name).join(" | ") }}
          </template>
          <template v-else>无家可归</template>
        </el-form-item>
      </el-form>
      <el-card
        slot="reference"
        :body-style="{ padding: '0px' }"
        :style="{ borderColor: players[0] ? players[0].color : '#fa4545' }"
      >
        <h2 :style="{ background: players[0] ? players[0].color : '#333335' }">
          {{ players[0] && players[0].chr }}
        </h2>
        <img
          :src="
            players[0] && require(`../../../../assets/${players[0].chr}.png`)
          "
        />
        <div>
          <img
            class="logo"
            :src="
              players[0] &&
                require(`../../../../assets/${players[0].chr}.png.png`)
            "
          />
          <h3>${{ players[0] && players[0].money }}</h3>
        </div>
      </el-card>
    </el-popover>

    <!-- 另外的玩家 -->
    <div class="grid">
      <el-popover
        placement="right"
        width="260"
        trigger="hover"
        popper-class="player-info"
        v-for="i in 3"
        :key="i"
        :disabled="!players[i]"
      >
        <el-form v-if="players[i]" label-width="60px" label-position="left">
          <el-form-item class="fixed" label="昵称">
            {{ players[i].name }}
          </el-form-item>
          <el-form-item class="fixed" label="角色">
            {{ players[i].chr }}
          </el-form-item>
          <el-form-item class="fixed" label="现金">
            ${{ players[i].money }}
          </el-form-item>
          <el-form-item class="fixed" label="资产">
            ${{ calTotal(players[i]) }}
          </el-form-item>
          <el-form-item class="fixed" label="薪水">
            ${{ players[i].salary }}
          </el-form-item>
          <el-form-item class="fixed" label="状态">
            {{ stateMap[players[i].state] }}
          </el-form-item>
          <el-form-item class="fixed" label="幸运">
            {{ players[i].luck * 100 }}%
          </el-form-item>
          <el-form-item class="fixed" label="方向">
            {{ directionMap[players[i].direction] }}
          </el-form-item>
          <el-form-item label="道具">
            <template v-if="players[i].cards.length">
              {{ players[i].cards.map(card => card.name).join(" | ") }}
            </template>
            <template v-else>空空如也</template>
          </el-form-item>
          <el-form-item label="地产">
            <template v-if="players[i].lands.length">
              {{ players[i].lands.map(land => land.name).join(" | ") }}
            </template>
            <template v-else>无家可归</template>
          </el-form-item>
        </el-form>
        <div
          slot="reference"
          class="box"
          :style="{ borderColor: players[i] ? players[i].color : '#ddd' }"
        >
          <h4 v-if="players[i]">${{ players[i].money }}</h4>
          <img
            class="chr"
            v-if="players[i]"
            :src="require(`../../../../assets/${players[i].chr}.png`)"
            alt
          />
          <img v-else :src="require('../../../../assets/null.png')" alt />
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    players: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      stateMap: {
        active: "活跃中",
        hospital: "住院中",
        jail: "坐牢中",
        bankrupt: "破产"
      },
      directionMap: ["逆时针", "顺时针"]
    };
  },
  methods: {
    calTotal(player) {
      if (player.lands.length) {
        let landValue = player.lands
          .map(land => land.value + land.price)
          .reduce((acc, cur) => acc + cur);
        return player.money + landValue;
      } else {
        return player.money;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.player-info {
  & {
    position: relative;
    padding: 10px;
    box-sizing: border-box;
    height: 265px;
  }
  .el-card {
    & {
      position: relative;
      width: 70%;
      border-radius: 5px;
      border: 2px solid #333335;
      box-sizing: border-box;
      cursor: pointer;
    }
    h2 {
      font-size: 18px;
      padding: 10px 0;
      text-align: center;
      color: #fafafa;
      height: 30px;
      line-height: 30px;
    }
    h3 {
      padding-left: 10px;
      height: 32px;
      line-height: 32px;
    }
    button {
      float: right;
    }
    img {
      position: relative;
      left: 10%;
      width: 80%;
      transform: scale(0.95);
    }
    img.logo {
      position: absolute;
      width: 52px;
      left: calc(100% - 55px);
      bottom: 0px;
    }
  }
  .grid {
    & {
      position: absolute;
      top: 10px;
      right: 10px;
      width: calc(30% - 18px);
      height: calc(100% - 20px);
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: repeat(3, 1fr);
      gap: 15px;
    }
    span {
      overflow: hidden;
      cursor: pointer;
    }
    .box {
      & {
        width: 100%;
        height: 100%;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        border-radius: 3px;
        overflow: hidden;
        border-width: 2px;
        border-style: solid;
        box-sizing: border-box;
      }
      h4 {
        text-align: center;
        color: #333335;
        font-weight: normal;
        font-size: 15px;
        height: 20px;
        line-height: 20px;
      }
      img {
        position: relative;
        width: 60%;
        left: 20%;
        top: 20%;
      }
      img.chr {
        width: 100%;
        left: 0;
        top: 0;
        transform: scale(1);
      }
    }
  }
}
::v-deep .el-form-item {
  & {
    margin-bottom: 0;
  }
  &.fixed {
    height: 30px;
    line-height: 30px;
    .el-form-item__label {
      line-height: 30px;
    }
    .el-form-item__content {
      line-height: 30px;
    }
  }
}
</style>
