<template>
  <div class="register">
    <section class="form_container">
      <div class="manage_tip">
        <span class="title">后台资金流水管理系统</span>
        <!-- status-icon	是否在输入框中显示校验结果反馈图标 -->
        <!-- rules	表单验证规则 -->
        <!-- model	表单数据对象 -->
        <!-- ref 帮助获取表单内容 -->
        <el-form
          :model="registerUser"
          :rules="rules"
          ref="registerForm"
          label-width="100px"
          class="registerForm"
        >
          <el-form-item label="用户名" prop="name">
            <el-input v-model="registerUser.name" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input type="email" v-model="registerUser.email" placeholder="请输入邮箱"></el-input>
          </el-form-item> 
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="registerUser.password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="password2">
            <el-input type="password" v-model="registerUser.password2" placeholder="请确认密码"></el-input>
          </el-form-item>

          <el-form-item label="选择身份">
            <el-select v-model="registerUser.identity" placeholder="请选择身份">
              <el-option label="管理员" value="manager"></el-option>
              <el-option label="员工" value="employee"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" class="submit_btn" @click="submitFrom('registerForm')">注册</el-button>
          </el-form-item>
        </el-form>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "register",
  // data开始
  data() {
    // 确认密码的验证
    let validatePass2 = (rule, value, callback) => {
      if (value !== this.registerUser.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      registerUser: {
        name: "",
        email: "",
        password: "",
        password2: "",
        identity: ""
      },
      rules: {
        // required: 是否必须填写, message:"提示信息", trigger: 何时出发
        name: [
          { required: true, message: "用户名不能为空", trigger: "change" },
          { min: 2, max: 30, message: "长度在2到30之间", trigger: "blur" }
        ],
        email: [
          {
            type: "email",
            required: true,
            message: "邮箱格式不正确",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, max: 30, message: "长度在6到30之间", trigger: "blur" }
        ],
        password2: [
          { required: true, message: "确认密码不能为空", trigger: "blur" },
          { min: 6, max: 30, message: "长度在2到30之间", trigger: "blur" },
          { validator: validatePass2, trigger: "blur" }
        ]
      }
    };
  },
  //   data结束
  methods: {
    submitFrom: function(formName) {
      console.log(formName);
      this.$refs[formName].validate(valid => {
        if (valid) {
          // alert("submit!");
          this.$axios
            .post("/api/users/register", this.registerUser)
            .then(res => {
              // 注册成功
              console.log("register sucess")
              this.$message({ message: "账号注册成功!", type: "success" });
            },error=>{
              console.log("register请求失败: " + error)
            });
            this.$router.push('/login');
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  components: {}
};
</script>

<style scoped>
.register {
  position: relative;
  width: 100%;
  height: 100%;
  background: url(../assets/bg.jpg) no-repeat center center;
  background-size: 100% 100%;
}
.form_container {
  width: 370px;
  height: 210px;
  position: absolute;
  top: 10%;
  left: 34%;
  padding: 25px;
  border-radius: 5px;
  text-align: center;
}
.form_container .manage_tip .title {
  font-family: "Microsoft YaHei";
  font-weight: bold;
  font-size: 26px;
  color: #fff;
}

/* 自定义整体样式 */
.registerForm {
  margin-top: 20px;
  background-color: #fff;
  padding: 20px 40px 20px 20px;
  border-radius: 5px;
  box-shadow: 0px 5px 10px #cccc;
}

/* 按钮样式 */
.submit_btn {
  width: 100%;
}
</style>

