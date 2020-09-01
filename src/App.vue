<template>
  <div id="app">
    <!-- <Header />
    <Sidebar />
    <Chat />
    -->
    <router-view />
  </div>
</template>
<script>
// import Header from '@/components/common/Header.vue';
// import Sidebar from '@/components/common/Sidebar.vue';
// import Chat from '@/components/common/Chat.vue';
export default {
  components: {
    // Header,
    // Sidebar,
    // Chat
  }
};
</script>
<style lang="scss">
* {
  margin: 0;
  padding: 0;
  user-select: none;
  outline: none;
  -webkit-tap-highlight-color: transparent;
}

html,
body,
#app {
  width: 100%;
  height: 100%;
}

h2.title {
  display: inline-block;
  background: teal;
  color: #fafafa;
  border-radius: 5px;
  padding: 7px 13px;
  font-weight: normal;
}

::-webkit-scrollbar {
  width: 3px;
  height: 3px;
}

::-webkit-scrollbar-thumb {
  background: teal;
}

.el-tag {
  cursor: pointer;
}
.el-message-box__content {
  color: #333;
}
.el-popover.center {
  text-align: center;
}
</style>
