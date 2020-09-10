<template>
  <div class="userlist">
    <h1>在 线 玩 家</h1>
    <div class="box">
      <UserItem v-for="user in users" :key="user.name" :user="user" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import UserItem from "@/components/common/UserItem.vue";
export default {
  components: {
    UserItem
  },
  computed: {
    ...mapGetters(["users"])
  }
};
</script>

<style lang="scss" scoped>
.box {
  height: calc(100% - 42px);
  overflow: auto;
}
</style>
