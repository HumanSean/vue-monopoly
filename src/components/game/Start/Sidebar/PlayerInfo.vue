<template>
  <div class="player-info">
    <el-card
      :body-style="{ padding: '0px' }"
      :style="{ borderColor: players[0] ? players[0].color : '#fa4545' }"
    >
      <h2 :style="{ background: players[0] ? players[0].color : '#454545' }">
        {{ players[0] && players[0].chr }}
      </h2>
      <img
        :src="players[0] && require(`../../../../assets/${players[0].chr}.png`)"
      />
      <div>
        <el-button
          type="primary"
          icon="el-icon-refresh"
          size="small"
        ></el-button>
        <h3>${{ players[0] && players[0].money }}</h3>
      </div>
    </el-card>
    <div class="grid">
      <div
        class="box"
        v-for="i in 3"
        :key="i"
        :style="{ borderColor: players[i] ? players[i].color : '#ddd' }"
      >
        <h4 v-if="players[i]">${{ players[i].money }}</h4>
        <img
          class="chr"
          v-if="players[i]"
          :src="require(`../../../../assets/${players[i].chr}.png`)"
          alt
        />
        <img v-else :src="require('../../../../assets/null.png')" alt="" />
      </div>
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
      width: 70%;
      border-radius: 5px;
      border: 2px solid #454545;
      box-sizing: border-box;
    }
    h2 {
      font-size: 18px;
      padding: 10px 0;
      text-align: center;
      border-top-left-radius: 3px;
      border-top-right-radius: 3px;
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
        color: #454545;
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
</style>
