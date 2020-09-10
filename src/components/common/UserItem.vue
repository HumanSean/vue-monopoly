<template>
  <div class="user-item">
    <el-avatar :src="user.avatar" :size="36"></el-avatar>
    <div class="info">
      <p>
        <el-tag type="primary" size="mini" effect="dark">
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
export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.user-item {
  & {
    padding: 3px 10px 0 10px;
    border-bottom: 1px solid #ddd;
  }
  .info {
    display: inline-block;
    margin-left: 10px;
  }
  p {
    & {
      height: initial;
      line-height: normal;
      font-size: 13px;
      clear: both;
    }
    img {
      width: 12px;
    }
  }
}
::v-deep .el-avatar {
  & {
    background: #ebe7f3;
    border: 1px solid #320f83;
  }
  img {
    transform: scale(2) translateY(12px);
  }
}
</style>
