<script lang="ts" setup>
import { ref } from 'vue'
import { useData } from 'vitepress'
import PostsList from './PostsList.vue'
import Pagination from './Pagination.vue'

const { theme } = useData()
const currentPage = ref(1)
const pageSize = 6

function chagnePage(page) {
  currentPage.value = page
}
</script>

<template>
  <PostsList :page="currentPage" :page-size="pageSize" />
  <Pagination
    :total="theme.posts.length"
    :curent-page="currentPage"
    :page-size="pageSize"
    :on-change="chagnePage"
  />
</template>

<style scoped>
</style>
