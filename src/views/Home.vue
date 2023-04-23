<template>
  <div>Home</div>
</template>

<script>
import {mapState} from 'vuex';

export default {
  name: "Home",
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

<style scoped>

</style>
