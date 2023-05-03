<template>
  <div>
    <div class="nav-header">
      <img src="../assets/img/sys-logo.png" alt="">
      <span>商品管理系统</span>
    </div>
    <el-menu
        default-active="1"
        style="text-align: left"
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
import {mapMutations, mapState} from "vuex";

export default {
  name: "AsideNav",
  computed: {
    ...mapState(['active_menu_index'])
  },
  methods: {
    ...mapMutations(['set_active_menu', 'set_active_menu_index']),
    handleSelect(key, keyPath) {
      //若当前选中的是已激活的菜单，则不进行处理
      if (this.active_menu_index === key) {
        return;
      }
      this.set_active_menu_index(key);//保存菜单的index
      switch (key) {
        case '1':
          this.set_active_menu('首页');
          break;
        case '2-1':
          this.set_active_menu('品类管理');
          break;
        case '2-2':
          this.set_active_menu('商品管理');
          break;
        case '3':
          this.set_active_menu('用户管理');
          break;
        case '4':
          this.set_active_menu('角色管理');
          break;
      }
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

//修改选中菜单项的背景色
.el-menu-item.is-active {
  color: #6681FA;
  background-color: #3d986e !important;
}
</style>
