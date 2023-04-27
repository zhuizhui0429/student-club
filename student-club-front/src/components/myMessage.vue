<script lang="ts">
export default {
  name: "MyMessage",
};
</script>

<script setup lang="ts">
import { defineProps } from "vue";
import type { MessageItemType } from "@api";
interface MyMessagePropsType {
  messageList: MessageItemType[];
}
defineProps<MyMessagePropsType>();
</script>

<template>
  <div class="message_box_container">
    <div v-for="message in messageList" :key="message.id" class="message">
      <img
        src="https://img1.baidu.com/it/u=207813528,1388000580&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=1200"
        alt=""
      />
      <div class="detail">
        <div class="name_date">
          <p class="name">健身俱乐部</p>
          <span class="date">2023-04-27 19:36</span>
        </div>
        <p class="activity_name">健身健美比赛</p>
        <p class="desc">
          这是一场比赛的描述这是一场比赛的描述这是一场比赛的描述
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.message_box_container {
  width: 330px;
  height: 400px;
  overflow-y: auto;
  padding: 10px 15px;
  padding-bottom: 50px;
  background-color: #dcebe4;
  .message {
    width: 300px;
    height: 132px;
    display: flex;
    box-sizing: border-box;
    padding: 20px 10px;
    background-color: rgb(242, 247, 255);
    border-radius: 12px;
    margin-bottom: 20px;
    img {
      flex: 0 0 auto;
      width: 42px;
      height: 42px;
      object-fit: cover;
      border-radius: 50%;
      margin-right: 10px;
    }
    .detail {
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
      .name_date {
        width: 100%;
        display: flex;
        justify-content: space-between;
        height: 40px;
        align-items: center;
        .name {
          font-size: 14px;
          color: #0062ff;
        }
        .date {
          font-size: 12px;
          color: #696974;
          transform: translateY(-8px);
        }
      }
      .activity_name {
        font-size: #171725;
        margin-bottom: 12px;
      }
      .desc {
        width: 100%;
        line-height: 16px;
        font-size: 14px;
        color: #92929d;
      }
    }
  }
}
</style>
