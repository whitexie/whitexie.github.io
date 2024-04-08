<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  total: number
  curentPage: number
  pageSize: number
  onChange: (page: number) => void
}
const props = defineProps<Props>()

const hasNext = computed(() => {
  return props.curentPage < props.total / props.pageSize
})

const hasPrev = computed(() => {
  return props.curentPage > 1
})

const totalPage = computed(() => {
  return Math.ceil(props.total / props.pageSize)
})

function handleClick(page: number) {
  props.onChange(page + props.curentPage)
}
</script>

<template>
  <nav class="pagination">
    <div>
      <span v-if="hasPrev" class="nav-item prev" @click="handleClick(-1)">
        &lt;&nbsp;NEWER
      </span>
    </div>
    <div class="total">
      <span class="total-item">
        {{ props.curentPage }} / {{ totalPage }}
      </span>
    </div>
    <div>
      <span v-if="hasNext" class="nav-item next" @click="handleClick(1)">
        &gt;&nbsp;OLDER
      </span>
    </div>
  </nav>
</template>

<style lang="less" scoped>
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .nav-item {
    cursor: pointer;
    color: #999;
    font-family: 'Montserrat', 'Helvetica Neue', 'Hiragino Sans GB', 'LiHei Pro',
      Arial, sans-serif;
    letter-spacing: 1px;
    border-bottom: 3px solid transparent;

    &:hover {
      color: #333;
      border-bottom-color: #333;
    }
  }
}
</style>
