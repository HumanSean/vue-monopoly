<template>
  <div class="header">
    <UserInfo></UserInfo>
    <el-button-group class="btn">
      <el-button type="primary" plain icon="el-icon-s-goods">包裹</el-button>
      <el-button type="primary" plain icon="el-icon-user-solid">角色</el-button>
      <el-button type="primary" plain icon="el-icon-s-shop">商城</el-button>
      <el-button type="primary" plain icon="el-icon-s-claim">任务</el-button>
      <el-button type="primary" plain icon="el-icon-s-promotion">
        好友
      </el-button>
      <el-button type="primary" plain icon="el-icon-s-tools">设定</el-button>
    </el-button-group>
  </div>
</template>

<script>
import UserInfo from "@/components/common/UserInfo.vue";
export default {
  components: {
    UserInfo
  }
};
</script>

<style lang="scss" scoped>
.header {
  & {
    position: relative;
    height: 65px;
    line-height: 65px;
    background: #320f83;
    font-family: Comic Sans MS;
  }
  .btn {
    & {
      float: right;
      margin: 13px;
    }
    button {
      border: none;
      border-left: 1px solid #320f83 !important;
    }
  }
}
</style>
