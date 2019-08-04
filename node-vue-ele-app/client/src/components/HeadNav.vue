<template>
  <header class="head-nav">
    <el-row>
      <!-- 左边logo + 标题 -->
      <el-col :span="6" class="logo-container">
        <img src="../assets/logo.png" alt class="logo" />
        <span class="title">资金流水管理系统</span>
      </el-col>
      <!-- 右边头像 + welcome + 下拉菜单 -->
      <el-col :span="6" class="user">
        <div class="userinfo">
          <!-- 头像 -->
          <img :src="user.avatar" class="avatar" alt />
          <div class="welcome">
            <p class="name">欢迎</p>
            <p class="name">{{user.name}}</p>
          </div>
          <span class="username">
            <!-- 下拉菜单 -->
            <!-- trigger设置为click i的class改成caret-bottom -->
            <el-dropdown trigger="click" @command="setDialogInfo">
              <span class="el-dropdown-link">
                <i class="el-icon-caret-bottom el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="info">个人信息</el-dropdown-item>
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </div>
      </el-col>
    </el-row>
  </header>
</template>

<script>
export default {
  name: "head-nav",
  //注意这里是computed
  computed: {
    user: function() {
      return this.$store.getters.user;
    }
  },
  components: {},
  methods: {
    // cmditem是下拉菜单command的值
    setDialogInfo: function(cmditem) {
      // console.log(cmditem);
      switch (cmditem) {
        case "info":
          this.showInfoList();
          break;
        case "logout":
          this.logout();
          break;
      }
    },
    showInfoList: function() {
      console.log("infoshow");
      this.$router.push("/infoshow");
    },
    logout: function() {
      // 删除token
      localStorage.removeItem("eleToken");
      // 清除vuex store
      this.$store.dispatch("clearCurrentState");
      // 跳转登录页面
      this.$router.push("/login");
    }
  }
};
</script>


<style scoped>
.head-nav {
  width: 100%;
  height: 60px;
  min-width: 600px;
  padding: 5px;
  background: #324057;
  color: #fff;
  border-bottom: 1px solid #1f2d3d;
}
.logo-container {
  line-height: 60px;
  min-width: 400px;
}
.logo {
  height: 50px;
  width: 50px;
  margin-right: 5px;
  vertical-align: middle;
  display: inline-block;
}
.title {
  vertical-align: middle;
  font-size: 22px;
  font-family: "Microsoft YaHei";
  letter-spacing: 3px;
}
.user {
  line-height: 60px;
  text-align: right;
  float: right;
  padding-right: 10px;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  vertical-align: middle;
  display: inline-block;
}
.welcome {
  display: inline-block;
  width: auto;
  vertical-align: middle;
  padding: 0 5px;
}
.name {
  line-height: 20px;
  text-align: center;
  font-size: 14px;
}
.comename {
  font-size: 12px;
}
.avatarname {
  color: #409eff;
  font-weight: bolder;
}
.username {
  cursor: pointer;
  margin-right: 5px;
}
.el-dropdown {
  color: #fff;
}
</style>
