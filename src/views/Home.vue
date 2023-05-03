<template>
  <el-container>
    <el-aside width="280px">
      <AsideNav/>
    </el-aside>
    <el-container>
      <el-header style="height: 80px">
        <TopBar/>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer style="height: 60px" class="footer">
        推荐使用谷歌浏览器，可获得更佳浏览体验
      </el-footer>
    </el-container>
  </el-container>
</template>

<script>
import {mapState} from 'vuex';

import AsideNav from "@/components/AsideNav";
import TopBar from "@/components/TopBar";

export default {
  name: "Home",
  components: {AsideNav, TopBar},
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

.el-header {
  padding: 0;
}

.el-footer {
  padding: 0;
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: #969696;
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
