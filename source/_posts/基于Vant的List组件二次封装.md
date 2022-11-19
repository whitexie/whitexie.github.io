---
title: 基于Vant的List组件二次封装
date: 2022-11-18 18:29:08
tags:
- Vue
- Vant
---

我们以一个商品搜索页面为例，该页面支持`关键字`检索商品；  
接下来，我们来明确下`List`组件需实现的功能：
- loading状态
- 加载到最后一页数据时，文案提示
- 下拉刷新(非必需)
- 触底翻页
- 空状态展示 

**请求入参：**  
```json
{
    "keyword": "", // 关键字
    "page": 1 // 
}
```
**响应参数:**
```json
{
    "code": 0,
    "msg": "ok",
    "data": {
        "total": 100, // 数据总数
        "list": [ // 列表数据
            goods
        ]
    },

}
```

在项目中，我们把每个接口都封装为一个函数, 函数返回一个Promise对象。
```js
// api/index.js

export function searchGoods(params) {
  return new Promise((resolve, reject) => {
    // 模拟发送请求
    setTimeout(() => {
      let data = [];
      let t = params.page * 10
      for (let i = 0; i < 10; i++) {
        const id = t + i
        data.push({
          id,
          pic: 'xxx',
          text: `xxxxx`
        });
      }
      resolve({
        code: 0,
        msg: "ok",
        data: {
          list: data,
          total: 110
        }
      });
    }, 500);
  });
}
```

创建List组件:
```html
<template>
  <div class="list-wrap">
    <Empty :description="description" v-if="finished && total === 0" />
    <PullRefresh v-else v-model="refreshing" :disabled="disabled_pullrefresh" @refresh="resetList">
      <List v-model="is_loading" :error.sync="error" :error-text="error_text" :finished="finished"
        :finished-text="finished_text" @load="nextPage">
        <slot></slot>
      </List>
    </PullRefresh>
  </div>
</template>

<script>
import { List, Empty, PullRefresh } from "vant";

export default {
  name: "ys-list",
  model: {
    prop: "list_data",
    event: "update",
  },
  props: {
    /**接口请求函数 */
    api_func: {
      type: Function,
    },
    /** 数据列表 */
    list_data: {
      type: Array,
      default() {
        return [];
      },
    },
    /** 发送请求时携带的其他参数 */
    params: {
      type: Object,
      default() {
        return {};
      },
    },
    /** 空状态展示文案 */
    description: {
      type: String,
      default: '暂无数据'
    },
    /** 加载完成文案 */
    finished_text: {
      type: String,
      default: '没有更多了'
    },
    /** 加载数据报错时显示的文案 */
    error_text: {
      type: String,
      default: '请求失败，点击重新加载'
    },
    /** 是否禁用下拉刷新 */
    disabled_pullrefresh: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      refreshing: false,
      is_loading: false,
      finished: false,
      error: false,
      page: 1,
      total: -1,
    };
  },
  watch: {
    params() {
      this.resetList()
    },
  },
  methods: {
    nextPage(override = false) {
      if (this.list_data.length === this.total) {
        this.finished = true;
        return;
      }
      let data = Object.assign(
        {
          page: this.page,
        },
        this.params
      );
      this.api_func(data).then((res) => {
        if (override) {
          this.$emit("update", [...res.data.list]);
        } else {
          this.$emit("update", [...this.list_data, ...res.data.list]);

        }
        this.total = res.data.total;
        this.page += 1;
        this.is_loading = false;
      }).catch(() => {
        this.is_loading = false
        this.error = true
      });
    },
    resetList() {
      this.refreshing = false
      this.$nextTick(() => {
        this.page = 1
        this.total = -1
        this.nextPage(true)
      })
    },
  },
  onMounted() { },
  components: {
    List,
    Empty,
    PullRefresh,
  },
};
</script>
```
这里说明下为什么要用`v-model`来双向绑定`list_data`，主要是方便在上层组件中对`list_data`进行修改，比如在商品列表中，对商品进行收藏、加入购物车等操作。  
通过`watch` 监听`params`，当`params`发生变化时，我们需要刷新列表数据，这里可以根据实际情况来决定是否进行监听。


示例完整代码：[codesandbox](https://codesandbox.io/s/business-list-component-bsyblz?file=/src/components/Goods.vue&resolutionWidth=320&resolutionHeight=675)