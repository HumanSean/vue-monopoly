<template>
  <div class="map">
    <div class="middle-box"></div>
    <el-popover
      placement="top-start"
      width="200"
      trigger="hover"
      v-for="i in 26"
      :key="i"
    >
      <div class="content" v-if="map[i - 1]">
        <h3>{{ map[seq[i - 1]].name }}</h3>
        <el-divider></el-divider>
        <template v-if="map[seq[i - 1]].type === 'land'">
          <el-form v-if="map[i - 1]" label-width="50px" label-position="left">
            <el-form-item v-if="map[seq[i - 1]].owner" label="地主">
              {{ map[seq[i - 1]].owner && map[seq[i - 1]].owner.chr }}
            </el-form-item>
            <el-form-item label="地价">
              ${{ map[seq[i - 1]].value }}
            </el-form-item>
            <el-form-item v-if="map[seq[i - 1]].owner" label="租金">
              ${{ map[seq[i - 1]].price }}
            </el-form-item>
            <el-form-item v-if="map[seq[i - 1]].owner" label="产值">
              ${{ map[seq[i - 1]].price + map[seq[i - 1]].value }}
            </el-form-item>
            <el-form-item label="状态">
              {{ landMap[map[seq[i - 1]].level] }}
            </el-form-item>
          </el-form>
        </template>
        <template v-else>
          <p>{{ map[seq[i - 1]].detail }}</p>
        </template>
      </div>
      <div slot="reference" class="box" ref="boxes"></div>
    </el-popover>
  </div>
</template>

<script>
import { reverseSeq as seq } from "@/utils/data";
export default {
  props: {
    map: {
      required: true
    }
  },
  data() {
    return {
      seq,
      landMap: ["空地", "小房子", "大豪宅", "大酒店"]
    };
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-divider {
  margin: 7px 0;
}
::v-deep .el-form-item {
  & {
    margin-bottom: 0;
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
    border: 1px solid #333335;
  }
  ::v-deep .box {
    & {
      position: relative;
      height: 100%;
      width: 100%;
      text-align: center;
      border: 1px solid #333335;
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
      border-bottom: 2px solid #333335;
    }
    h3 {
      color: #333335;
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
    border: 1px solid #333335;
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
