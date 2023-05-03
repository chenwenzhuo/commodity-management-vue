<template>
  <div class="login-container">
    <div class="login-header">
      <img src="../assets/img/sys-logo.png" alt="">
      <span>商品管理系统</span>
    </div>
    <div class="login-form-container">
      <div class="login-form-title">用户登陆</div>
      <el-form class="login-form" :model="loginForm" status-icon :rules="rules" ref="loginForm" label-width="100px">
        <el-form-item prop="username" label-width="0">
          <el-input class="login-input" type="text" v-model="loginForm.username" autocomplete="off"
                    prefix-icon="el-icon-user" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password" label-width="0">
          <el-input class="login-input" type="password" v-model="loginForm.password" autocomplete="off"
                    prefix-icon="el-icon-lock" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item label-width="0">
          <el-button class="login-btn" type="primary" native-type="submit"
                     @click="submitForm('loginForm')">
            提交
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex';
import ajaxMtd from "@/utils/ajax";

export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('用户名不能为空'));
      } else if (value.length < 4) {
        callback(new Error('用户名长度不少于4位'));
      } else if (value.length > 12) {
        callback(new Error('用户名长度不多于12位'));
      } else if (!/[a-zA-Z0-9_]/.test(value)) {
        callback(new Error('用户名应由字母、数字、下划线组成'));
      } else {
        if (this.loginForm.password !== '') {
          this.$refs.loginForm.validateField('password');
        }
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('密码不能为空'));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: '',
        password: '',
      },
      rules: {
        username: [
          {validator: validateUsername, trigger: 'blur'}
        ],
        password: [
          {validator: validatePassword, trigger: 'blur'}
        ]
      }
    };
  },
  computed: {
    ...mapState(['logged_usr'])
  },
  methods: {
    ...mapMutations(['save_usr']),
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (!valid) {
          console.log('error submit!!');
          return false;
        }
        const response = await ajaxMtd('/login', this.loginForm, 'POST');//发送请求验证用户名、密码
        if (response.status === 0) {//登陆成功
          this.save_usr(response.data);
          this.$router.replace('/');
        } else {
          this.$message.error("登陆失败，请检查用户名和密码是否正确");
          this.save_usr(null);
        }
      });
    }
  },
}
</script>

<style lang="less" scoped>
.login-container {
  width: 100%;
  height: 100%;
  background-image: url("../assets/img/bg.jpg");
  background-size: 100%; /*拉伸背景图片，占满容器*/
  position: relative;

  .login-header {
    width: 100%;
    height: 100px;
    background-color: rgba(0, 0, 0, .6);
    display: flex;
    justify-content: flex-start;
    align-items: center;

    img {
      width: 75px;
      margin-left: 40px;
    }

    span {
      font-size: 40px;
      font-weight: bolder;
      color: #ffffff;
      margin-left: 30px;
    }
  }

  .login-form-container {
    width: 550px;
    height: 360px;
    background-color: #ffffff;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;

    .login-form-title {
      width: 200px;
      font-size: 30px;
      font-weight: bold;
      text-align: center;
      margin: 50px auto 0;
    }

    .login-form {
      margin-top: 40px;
      background-color: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .login-input, .login-btn {
        width: 400px;
      }
    }
  }
}
</style>
