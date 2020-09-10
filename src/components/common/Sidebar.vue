<template>
  <div class="sidebar">
    <UserList></UserList>
    <ChatRoom></ChatRoom>
  </div>
</template>

<script>
import UserList from "@/components/common/UserList.vue";
import ChatRoom from "@/components/common/ChatRoom.vue";
export default {
  components: {
    UserList,
    ChatRoom
  }
};
</script>

<style lang="scss" scoped>
.sidebar {
  & {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 20px;
    padding-left: 0;
    display: grid;
    grid-template-rows: 1fr 1fr;
    // gap: 20px;
  }
  > div {
    border: 2px solid #320f83;
    border-radius: 3px;
    // box-sizing: border-box;
    width: 100%;
    height: 100%;
    overflow: auto;
    ::v-deep h1 {
      height: 40px;
      line-height: 40px;
      background: #320f83;
      color: #fff;
      font-size: 16px;
      font-weight: normal;
      text-indent: 13px;
    }
  }
}
</style>
