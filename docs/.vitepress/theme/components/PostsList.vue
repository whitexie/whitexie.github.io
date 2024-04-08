<script lang="ts" setup>
import { computed, withDefaults } from 'vue'
import { useData } from 'vitepress'

interface Props {
  page: number
  pageSize: number
}

const props = withDefaults(defineProps<Props>(), {
  page: 1,
  pageSize: 6,
})

const { theme } = useData()
const posts = computed(() => {
  const { posts: postsList } = theme.value

  const startIndex = (props.page - 1) * props.pageSize
  const endIndex = startIndex + props.pageSize

  return postsList.slice(startIndex, endIndex)
})
</script>

<template>
  <ul>
    <li v-for="item in posts" :key="item.regularPath">
      <h3>{{ item.frontMatter.date }}</h3>
      <h2>
        <a :href="item.regularPath">
          {{ item.frontMatter.title }}
        </a>
      </h2>
    </li>
  </ul>
</template>

<style scoped>
</style>
