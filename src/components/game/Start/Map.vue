<template>
  <div class="map">
    <div class="middle-box"></div>
    <div class="box" v-for="i in 26" :key="i" ref="boxes"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.map {
  & {
    width: calc(100% - 300px);
    height: 100%;
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: repeat(5, 1fr);
    gap: 0px;
    overflow: hidden;
    box-sizing: border-box;
    border: 1px solid #454545;
  }
  ::v-deep .box {
    & {
      position: relative;
      height: 100%;
      width: 100%;
      text-align: center;
      border: 1px solid #454545;
      box-sizing: border-box;
    }
    h2 {
      color: #fafafa;
      font-weight: 400;
      font-size: 15px;
      height: 30px;
      line-height: 30px;
      overflow: hidden;
      white-space: nowrap;
      text-align: center;
      border-bottom: 2px solid #454545;
    }
    h3 {
      color: #454545;
      font-weight: 400;
      font-size: 15px;
      height: 30px;
      line-height: 30px;
      white-space: nowrap;
      text-align: center;
      position: absolute;
      width: 100%;
      bottom: 0;
    }
    img {
      width: 88%;
      position: absolute;
      bottom: 3%;
      left: 6%;
    }
    img.chr {
      animation: moving 0.8s;
    }
    img.bg {
      width: 80%;
      left: 10%;
      top: 13%;
    }
  }
  .middle-box {
    position: relative;
    background: url("../../../assets/bg.jpg");
    background-size: 100% 100%;
    grid-area: 2 / 2 / -2 / -2;
    box-sizing: border-box;
    border: 1px solid #454545;
  }
}
@keyframes moving {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
