<template>
  <div class="hallmain">
    <div class="main">
      <div class="info">
        <span>游 戏 大 厅</span>
        <el-button size="mini" type="primary" plain @click="showAdd = true">
          新建房间
        </el-button>
      </div>
      <div class="box" v-if="true">
        <div class="table" v-for="room in rooms" :key="room.id">
          <img class="center" src="../../assets/table.png" alt="" />
          <div
            class="chair center"
            v-for="(seat, index) in room.seats"
            :key="index"
            @click="enterRoom(room.id)"
          >
            <!-- <img src="../../assets/null.png" alt="" /> -->
            <img v-if="seat.user" :src="seat.user.avatar" alt="" />
            <p v-if="seat.user">
              {{ seat.user.name }}
            </p>
          </div>
        </div>
      </div>
      <div v-else class="center">
        目前没有正在游戏中的桌子，快去创建一个吧！
      </div>
    </div>
    <el-dialog title="新建房间" :visible.sync="showAdd" width="50%">
      <el-form :model="form" label-width="40px">
        <el-form-item label="名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="showAdd = false">取 消</el-button>
        <el-button type="primary" @click="addRoom">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      showAdd: false,
      form: {
        name: ""
      }
    };
  },
  computed: {
    ...mapState(["user", "ws", "rooms"])
  },
  methods: {
    enterRoom(id) {
      this.$ws.enterRoom(id, this.user);
      // this.$router.push("room");
    },
    addRoom() {
      this.showAdd = false;
      let seats = [];
      for (let i = 0; i < 4; i++) {
        seats.push({
          state: "empty",
          user: null
        });
      }
      let room = {
        id: new Date().getTime(),
        name: this.form.name,
        seats
      };
      this.form.name = "";
      this.rooms.push(room);
      this.$ws.addRoom(room);
      this.enterRoom(room.id);
    }
  }
};
</script>

<style lang="scss" scoped>
.hallmain {
  & {
    width: 100%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    overflow: hidden;
    font-family: Comic Sans MS;
  }
  .main {
    & {
      position: relative;
      width: 100%;
      height: 100%;
      border: 2px solid #320f83;
      border-radius: 3px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .info {
      & {
        height: 40px;
        line-height: 40px;
        background: #320f83;
        color: #fff;
      }
      span {
        font-size: 16px;
        margin-left: 13px;
      }
      button {
        float: right;
        margin: 5px;
      }
    }
    .box {
      & {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        justify-items: center;
        align-items: center;
        overflow: auto;
        gap: 15px;
      }
      .table {
        & {
          position: relative;
          width: 260px;
          height: 260px;
          transform: rotate(45deg);
        }
        > img {
          width: 100px;
        }
        .chair {
          & {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 3px solid #333335;
            position: absolute;
          }
          img {
            position: relative;
            top: -10%;
            left: -10%;
            width: 117%;
            transform: rotate(-45deg);
          }
          p {
            margin-left: -30px;
            width: 100px;
            text-align: center;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        .chair:first-of-type {
          top: 10%;
        }
        .chair:nth-of-type(2) {
          left: 10%;
        }
        .chair:nth-of-type(3) {
          top: 90%;
        }
        .chair:last-of-type {
          left: 90%;
        }
      }
    }
  }
}
.center {
  width: 90%;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.el-form-item {
  margin-bottom: 0;
}
</style>
