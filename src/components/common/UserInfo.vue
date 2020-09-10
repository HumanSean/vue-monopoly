<template>
  <div class="user-info">
    <el-avatar :src="user.avatar" :size="42"></el-avatar>
    <div class="info">
      <p>
        <el-tag type="primary" size="small" effect="plain">
          {{ user.name }}
        </el-tag>
      </p>
      <p>
        Lv {{ user.level }}
        <span style="margin-left: 5px"> </span>
        <img src="../../assets/coin.png" alt="" />
        {{ user.money }}
      </p>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["user"])
  }
};
</script>

<style lang="scss" scoped>
.user-info {
  & {
    position: absolute;
    top: 0;
    left: 13px;
    height: 100%;
    cursor: pointer;
  }
  .info {
    float: right;
    margin-left: 7px;
  }
  p {
    & {
      color: #eaeaea;
      height: initial;
      line-height: normal;
      font-size: 15px;
    }
    img {
      width: 12px;
    }
  }
  p:first-of-type {
    margin-top: 12px;
  }
}
::v-deep .el-avatar {
  & {
    background: #ebe7f3;
    margin-top: 12px;
  }
  img {
    transform: scale(2) translateY(12px);
  }
}
</style>
