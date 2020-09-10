<template>
  <div class="home">
    <h1>Welcome to Vue Monopoly!</h1>
    <div class="box">
      <h2 @click="goto('game')">单机模式</h2>
      <h2 @click="goto('hall')">联网游戏</h2>
      <h2 @click="showDetail('about')">关 于</h2>
      <h2 @click="showDetail('setting')">设定</h2>
    </div>
    <el-dialog
      title=""
      :visible.sync="showLogin"
      width="50%"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-form ref="login" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="昵称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="confirmPassword"
          v-if="state === 'register'"
        >
          <el-input type="password" v-model="form.confirmPassword"></el-input>
        </el-form-item>
      </el-form>
      <el-tag
        size="mini"
        effect="plain"
        @click="state = state === 'login' ? 'register' : 'login'"
      >
        <template v-if="state === 'register'">已有账号？点此登录！</template>
        <template v-else>还没账号？点此注册！</template>
      </el-tag>
      <div slot="footer">
        <el-button @click="showLogin = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">
          <template v-if="state === 'login'">登 录</template>
          <template v-else>注 册</template>
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  data() {
    return {
      showLogin: false,
      state: "login",
      form: {
        name: "",
        password: "",
        confirmPassword: "",
        avatar: "https://humansean.com/avatar/Batman.png",
        level: 1,
        money: 1000,
        state: "online"
      },
      rules: {
        name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 12, message: "长度在 2 到 9 个字符", trigger: "blur" },
          {
            validator: async (rule, value, cb) => {
              await this.getData();
              if (
                this.users.map(user => user.name).includes(value) &&
                this.state === "register"
              ) {
                cb(new Error());
              } else {
                cb();
              }
            },
            message: "该昵称已经有人用啦！",
            trigger: "blur"
          },
          {
            validator: (rule, value, cb) => {
              if (
                this.state === "login" &&
                this.users.find(user => {
                  return user.name === value && user.state === "online";
                })
              ) {
                cb(new Error());
              } else {
                cb();
              }
            },
            message: "该用户已经登录了！",
            trigger: "blur"
          },
          {
            validator: (rule, value, cb) => {
              if (value.includes(" ") && this.state === "register") {
                cb(new Error());
              } else {
                cb();
              }
            },
            message: "不允许使用空格！",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "change" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ],
        confirmPassword: [
          {
            validator: (rule, value, cb) => {
              if (this.form.password !== value) {
                cb(new Error());
              } else {
                cb();
              }
            },
            message: "两次密码输入不一致",
            trigger: "blur"
          }
        ]
      },
      users: []
    };
  },
  computed: {
    ...mapState(["user"])
  },
  methods: {
    ...mapMutations(["setUser"]),
    ...mapActions(["setWs"]),
    getData() {
      return new Promise(resolve => {
        this.$axios.get("/api/users").then(res => {
          this.users = res.data.data.users;
          resolve();
        });
      });
    },
    async goto(path) {
      if (path === "hall") {
        if (!this.user) {
          this.showLogin = true;
          return;
        } else {
          await this.getData();
          if (
            this.users.find(user => {
              return user.name === this.user.name && user.state === "online";
            })
          ) {
            this.showLogin = true;
            return;
          }
          this.setWs(new WebSocket("ws://localhost:8001"));
        }
      }
      this.$router.push(path);
    },
    showDetail(content) {
      console.log(content);
    },
    submitForm() {
      if (this.state === "register") {
        this.$refs["login"].validate(valid => {
          if (valid) {
            this.addUser();
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      } else {
        let params = {
          name: this.form.name,
          password: this.form.password
        };
        this.$axios.get("/api/login", { params }).then(res => {
          if (res.data.data.user) {
            this.login(res.data.data.user);
          } else {
            this.$message.error("用户名或密码错误！请重新输入！");
          }
        });
      }
    },
    addUser() {
      let params = Object.assign({}, this.form);
      delete params.confirmPassword;
      this.$axios
        .get("/api/add/user", { params })
        .then(() => {
          this.$message.success("注册成功！");
          this.login(params);
        })
        .catch(() => {});
    },
    login(user) {
      localStorage.setItem("user", JSON.stringify(user));
      this.setUser();
      this.showLogin = false;
      this.setWs(new WebSocket("ws://localhost:8001"));
      this.$router.push("hall");
    }
  },
  mounted() {
    this.getData();
  }
};
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
  text-align: center;
  overflow: hidden;
  background: #320f83;
}
.home h1 {
  margin: 65px 0;
  padding: 13px 0;
  background: #fff;
  color: #320f83;
  font-family: comic sans ms;
}
.home h2 {
  box-sizing: border-box;
  margin: 26px;
  padding: 10px 26px;
  width: 50%;
  transform: translateX(50%);
  background: #fff;
  color: #320f83;
  border-radius: 3px;
  cursor: pointer;
}
.home .box {
  width: 100%;
  position: absolute;
  top: 58%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
