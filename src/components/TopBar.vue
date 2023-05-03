<template>
  <div class="top-bar-container">
    <div class="upper">
      <span>欢迎，{{ logged_usr.username }}</span>
      <button @click="logout">退出登陆</button>
    </div>
    <div class="lower">
      <span class="route-name">{{ active_menu }}</span>
      <span class="time">{{ time }}</span>
    </div>
  </div>
</template>

<script>
import {mapState, mapMutations} from "vuex";

import {formatTime} from "@/utils/tools";

export default {
  name: "TopBar",
  data() {
    return {
      timeUpdater: null
    }
  },
  computed: {
    ...mapState(['logged_usr', 'time', 'active_menu'])
  },
  methods: {
    ...mapMutations(['clear_usr', 'update_time']),
    logout() {
      this.clear_usr();//清除已登陆的用户
      this.$router.replace('/login');//跳转到登陆界面
    }
  },
  mounted() {
    //组件挂载时，一秒修改一次时间
    this.timeUpdater = setInterval(() => {
      let now = Date.now();
      this.update_time(formatTime(now));//更新vuex中的时间
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.timeUpdater);
  }
}
</script>

<style scoped lang="less">
.top-bar-container {
  box-sizing: border-box;
  height: 100%;

  .upper {
    text-align: right;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #1DA57A;

    button {
      margin: 0 18px;
      padding: 0;
      border: 0;
      background-color: rgba(255, 255, 255, 0);
      color: #1DA57A;
      cursor: pointer;
    }
  }

  .lower {
    height: 40px;
    line-height: 40px;
    display: flex;
    justify-content: space-between;

    .route-name {
      margin-left: 150px;
      font-size: 28px;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        border: 20px solid;
        border-color: #ffffff transparent transparent transparent;
        top: 95%;
        left: 50%;
        transform: translateX(-50%);
      }
    }

    .time {
      margin-right: 20px;
    }
  }
}
</style>
