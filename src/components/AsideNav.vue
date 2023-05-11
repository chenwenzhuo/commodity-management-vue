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
            <el-menu-item index="1" v-if="menuDisplay.home">
                <template slot="title">
                    <i class="el-icon-s-home"></i>
                    <span>首页</span>
                </template>
            </el-menu-item>
            <el-submenu index="2" v-if="menuDisplay.category||menuDisplay.product">
                <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>商品</span>
                </template>
                <el-menu-item index="2-1" v-if="menuDisplay.category">品类管理</el-menu-item>
                <el-menu-item index="2-2" v-if="menuDisplay.product">商品管理</el-menu-item>
            </el-submenu>
            <el-menu-item index="3" v-if="menuDisplay.user">
                <i class="el-icon-document"></i>
                <span slot="title">用户管理</span>
            </el-menu-item>
            <el-menu-item index="4" v-if="menuDisplay.role">
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
        ...mapState(['active_menu_index', 'logged_usr']),
        menuDisplay() {
            //如果是admin用户，则有全部菜单权限
            if (this.logged_usr.username === 'admin') {
                return {
                    home: true, category: true, product: true,
                    user: true, role: true
                }
            }
            return {
                home: this.logged_usr.role.menus.includes('/home'),
                category: this.logged_usr.role.menus.includes('/category'),
                product: this.logged_usr.role.menus.includes('/product'),
                user: this.logged_usr.role.menus.includes('/user'),
                role: this.logged_usr.role.menus.includes('/role')
            };
        }
    },
    methods: {
        ...mapMutations(['set_active_menu', 'set_active_menu_index']),
        handleSelect(key) {
            this.set_active_menu_index(key);//保存菜单的index
            switch (key) {
                case '1':
                    this.set_active_menu('首页');
                    this.$router.push('/home');
                    break;
                case '2-1':
                    this.set_active_menu('品类管理');
                    this.$router.push('/category');
                    break;
                case '2-2':
                    this.set_active_menu('商品管理');
                    this.$router.push('/product');
                    break;
                case '3':
                    this.set_active_menu('用户管理');
                    this.$router.push('/user');
                    break;
                case '4':
                    this.set_active_menu('角色管理');
                    this.$router.push('/role');
                    break;
            }
        }
    },
    mounted() {
        this.handleSelect(this.active_menu_index);
    },
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
