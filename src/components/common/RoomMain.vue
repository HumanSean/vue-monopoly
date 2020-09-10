<template>
  <div class="hallmain">
    <div class="main">
      <div class="info">
        <span>游 戏 大 厅</span>
        <el-button size="mini" type="primary" plain>新建房间</el-button>
      </div>
      <div class="box" v-if="true">
        <div class="table" v-for="i in 10" :key="i">
          <img class="center" src="../../assets/table.png" alt="" />
          <div
            class="chair center"
            v-for="i in 4"
            :key="i"
            @click="goto('room')"
          >
            <img src="../../assets/null.png" alt="" />
          </div>
        </div>
      </div>
      <div v-else class="center">
        目前没有正在游戏中的桌子，快去创建一个吧！
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goto(path) {
      this.$router.push(path);
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
        gap: 26px;
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
</style>
