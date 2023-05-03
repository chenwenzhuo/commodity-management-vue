<template>
  <div>
    <div class="nav-header">
      <img src="../assets/img/sys-logo.png" alt="">
      <span>商品管理系统</span>
    </div>
    <el-menu
        default-active="1"
        style="text-align: left"
        @open="handleOpen"
        @close="handleClose"
        @select="handleSelect"
        background-color="#0e1520"
        text-color="#ffffff"
        active-text-color="#ffd04b">
      <el-menu-item index="1">
        <template slot="title">
          <i class="el-icon-s-home"></i>
          <span>首页</span>
        </template>
      </el-menu-item>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>商品</span>
        </template>
        <el-menu-item index="2-1">品类管理</el-menu-item>
        <el-menu-item index="2-2">商品管理</el-menu-item>
      </el-submenu>
      <el-menu-item index="3">
        <i class="el-icon-document"></i>
        <span slot="title">用户管理</span>
      </el-menu-item>
      <el-menu-item index="4">
        <i class="el-icon-setting"></i>
        <span slot="title">角色管理</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "AsideNav",
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>

<style scoped lang="less">
.nav-header {
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 60px;
  }

  span {
    font-size: 28px;
    font-weight: bold;
    color: #ffffff;
  }
}
</style>
