<template>
  <el-container>
    <el-aside width="280px">
      <AsideNav/>
    </el-aside>
    <el-container>
      <el-header>Header</el-header>
      <el-main>Main</el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </el-container>
</template>

<script>
import {mapState} from 'vuex';

import AsideNav from "@/components/AsideNav";

export default {
  name: "Home",
  components: {AsideNav},
  computed: {
    ...mapState({curUser: 'logged_usr'}),//获取vuex中存储的当前已登陆用户
  },
  mounted() {
    if (!this.curUser) {//若没有已登陆的用户，自动跳转到登陆界面
      this.$router.replace('/login');
    }
  }
}
</script>

<style scoped lang="less">
.el-container {
  height: 100%;
}

.el-header, .el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #0e1520;
  color: #333;
  text-align: center;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 160px;
}
</style>
