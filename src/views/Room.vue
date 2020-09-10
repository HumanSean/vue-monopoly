<template>
  <div class="hall">
    <el-container>
      <el-header height="52px">
        <Header></Header>
      </el-header>
      <el-container>
        <el-main>
          <RoomMain></RoomMain>
        </el-main>
        <el-aside width="300px">
          <Sidebar></Sidebar>
        </el-aside>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Header from "@/components/common/Header.vue";
import RoomMain from "@/components/common/RoomMain.vue";
import Sidebar from "@/components/common/Sidebar.vue";
export default {
  components: {
    Header,
    RoomMain,
    Sidebar
  }
};
</script>

<style lang="scss" scoped>
.el-header,
.el-main {
  padding: 0;
}
.hall {
  width: 100%;
  height: 100%;
}
.el-container {
  width: 100%;
  height: 100%;
  .el-container {
    width: 100%;
    height: calc(100% - 52px);
  }
}
.el-aside {
  height: 100%;
}
</style>
