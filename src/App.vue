<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
/*需要把body，html标签和app容器的宽高都设为100%，否则应用内容可能占不满整个屏幕*/
body, html {
  width: 100%;
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
  width: 100%;
  height: 100%;
}
</style>
