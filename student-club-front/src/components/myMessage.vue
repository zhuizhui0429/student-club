<script lang="ts">
export default {
  name: "MyMessage",
};
</script>

<script setup lang="ts">
import {
  MessageResType as MessageItemType,
  sendMessage,
  approveJoin,
  refuseJoin,
  HandleStatus,
} from "@api";
import { useUserStore } from "@store";
import { storeToRefs } from "pinia";
import dayjs from "dayjs";

const map: Partial<Record<HandleStatus, string>> = {
  approved: "accept",
  refused: "refuse",
};

interface MyMessagePropsType {
  messageList: MessageItemType[];
}
defineProps<MyMessagePropsType>();
const userStore = useUserStore();
const { id, name, avatar } = storeToRefs(userStore);
const handleReject = (message: MessageItemType) => {
  const { senderId: applicantId, id: applicantMessageId } = message;
  refuseJoin({
    applicantId,
    applicantMessageId: applicantMessageId!,
    managerId: id.value,
    reason: "",
  });
};

const handleApproval = (message: MessageItemType) => {
  const { senderId: applicantId, id: applicantMessageId } = message;
  approveJoin({
    applicantId,
    applicantMessageId: applicantMessageId!,
    managerId: id.value,
  });
};
</script>

<template>
  <div class="message_box_container">
    <div v-for="message in messageList" :key="message.id" class="message">
      <div class="message_content">
        <img :src="message.senderAvatar" alt="" />
        <div class="detail">
          <div class="name_date">
            <p class="name">{{ message.senderName }}</p>
            <span class="date">{{
              dayjs(message.createTime0).format("YYYY-MM-DD HH:mm:ss")
            }}</span>
          </div>
          <p class="activity_name">
            {{ message.title }}
            <span
              class="status"
              v-if="
                message.type === 'joinClubApplication' &&
                message.handleStatus !== 'pending'
              "
            >
              has {{ map[message.handleStatus] }}</span
            >
          </p>
          <p class="desc">
            {{ message.content }}
          </p>
        </div>
      </div>
      <div
        class="operation_area"
        v-if="
          message.type === 'joinClubApplication' &&
          message.handleStatus === 'pending'
        "
      >
        <a-button danger @click="handleReject(message)">refuse</a-button>
        <a-button
          style="margin-left: 16px"
          type="primary"
          @click="handleApproval(message)"
          >accept</a-button
        >
      </div>
    </div>
    <a-empty v-if="!messageList.length" description="no news" />
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
  .status {
    font-size: 12px;
    margin-left: 8px;
  }
  .operation_area {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
  }
  .message_content {
    width: 300px;
    height: 132px;
    display: flex;
    box-sizing: border-box;
    padding: 20px 10px;
    background-color: rgb(242, 247, 255);
    border-radius: 12px;
    margin-bottom: 15px;
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
