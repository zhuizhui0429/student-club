<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    loading: {
      type: Boolean,
      default: true,
    },
    initialHeight: {
      type: String,
      default: "100%",
    },
    size: {
      type: String,
      validator(val) {
        return ["small", "large", "default"].includes(val as string);
      },
      default: "default",
    },
    backgroundColor: {
      type: String,
      default: "#dcebe4",
    },
  },
  setup() {},
});
</script>

<template>
  <div
    class="loading_container"
    v-show="loading"
    :style="`height:${initialHeight};background-color:${backgroundColor}`"
  >
    <a-spin tip="数据加载中..." :size="size" :spinning="loading"></a-spin>
  </div>
</template>

<style lang="less" scoped>
.loading_container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 999;
  top: 0;
  left: 0;
}
</style>
