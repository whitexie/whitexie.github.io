<script setup lang="ts">
import { useData } from 'vitepress';
import Page from './Page.vue';

// https://vitepress.dev/reference/runtime-api#usedata
const { site, frontmatter } = useData();
</script>

<template>
  <div class="header">
    <a href="/">

      {{ site.title }}
    </a>
  </div>
  <p class="links" />
  <div class="main">
    <Page v-if="frontmatter.home" />
    <div v-else>
      <Content class="vp-doc" />
    </div>
  </div>
</template>

<style>
* {
  padding: 0;
}
body {
  font-family: 'Roboto', 'Helvetica Neue', 'Hiragino Sans GB', 'LiHei Pro',
    Arial, serif;
  text-rendering: optimizelegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: 400;
  font-size: 16px;
  word-spacing: 1px;
  color: #666;
  margin: 0;
}
</style>

<style lang="less">
.header {
  font-family: 'Montserrat', 'Helvetica Neue', 'Hiragino Sans GB', 'LiHei Pro',
    Arial, sans-serif;
  font-weight: 400;
  color: #444;

  letter-spacing: 5px;
  margin: 50px auto 15px;
  text-align: center;
}
</style>
