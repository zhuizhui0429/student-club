<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    poster: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    entryCondition: {
      type: String,
      default: "免费",
    },
  },
  setup() {},
});
</script>

<template>
  <div class="activity_card_container">
    <img :src="poster" alt="" class="poster" />
    <div class="info">
      <p class="title">{{ title }}</p>
      <span>时间: {{ date }}</span>
      <span>地点: {{ location }}</span>
      <span>入场条件：{{ entryCondition }}</span>
    </div>
  </div>
</template>

<style lang="less" scoped>
.activity_card_container {
  width: 100%;
  height: 170px;
  border-radius: 12px;
  display: flex;
  box-sizing: border-box;
  padding-left: 20px;
  align-items: center;
  margin-bottom: 12px;
  background-color: white;
  border: 1px solid lightblue;
  img {
    width: 120px;
    height: 154px;
    object-fit: cover;
    margin-right: 15px;
    border-radius: 10px;
  }
  .info {
    display: flex;
    flex-direction: column;
    height: 100%;
    .title {
      color: #3b2828;
      font-size: 17px;
      line-height: 50px;
    }
    span {
      color: #8c8787;
      font-size: 14px;
      display: block;
      margin-top: 8px;
    }
  }
}
</style>
