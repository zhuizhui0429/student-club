<script lang="ts">
export default {
  name: "CreateClub",
};
</script>

<script setup lang="ts">
import { RuleObject } from "ant-design-vue/es/form/interface";
import { FormExpose } from "ant-design-vue/es/form/Form";
import { reactive, ref, onMounted } from "vue";
import {
  getAllManagers,
  GetAllManagersResType,
  createClub,
  CreateClubPayload as ClubFormStateType,
} from "@api";
import AvatarUpload from "@/components/avatarUpload.vue";

const formRef = ref<FormExpose>({} as any);
const formState = reactive<ClubFormStateType>({} as any);
const rules: Record<keyof ClubFormStateType, RuleObject | RuleObject[]> = {
  poster: {
    required: true,
    message: "Please upload a poster image of the event",
  },
  clubName: [
    {
      required: true,
      message: "Please fill in the club name",
      trigger: "blur",
    },
    {
      min: 2,
      max: 20,
      message:
        "The length of the club name should be between 2 and 20 characters",
      trigger: "change",
    },
  ],
  managerId: {
    required: true,
    message: "Please select a manager for this club",
  },
  description: [
    {
      required: true,
      message: "Please fill in the club profile",
      trigger: "blur",
    },
    {
      min: 10,
      max: 300,
      message:
        "The number of words in the introduction of the club should be between 10 and 300",
      trigger: "change",
    },
  ],
};

const labelCol = { span: 4 };
const wrapperCol = { span: 14, offset: 2 };

const managerOptions = ref<GetAllManagersResType>([]);
onMounted(() => {
  getAllManagers().then((res) => {
    managerOptions.value = res.data.data;
  });
});

const handleCreateClub = () => {
  formRef.value.validateFields().then((res) => {
    createClub(res as ClubFormStateType);
  });
};
</script>
<template>
  <div class="create_club_container">
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
    >
      <a-form-item label="club avatar" name="poster">
        <AvatarUpload
          v-model:avatarFile="formState.poster"
          :initialAvatar="formState.poster"
        />
      </a-form-item>
      <a-form-item label="club name" name="clubName">
        <a-input
          v-model:value="formState.clubName"
          placeholder="Please enter a club name"
        />
      </a-form-item>
      <a-form-item label="club manager" name="managerId">
        <a-select
          v-model:value="formState.managerId"
          placeholder="Please select the manager corresponding to the new club"
        >
          <a-select-option
            v-for="manager in managerOptions"
            :key="manager.id"
            :value="manager.id"
            :disabled="Boolean(manager.managerClubName)"
            >{{
              manager.managerClubName
                ? `${manager.name} - ${manager.managerClubName}`
                : manager.name
            }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item label="Club Profile" name="description">
        <a-textarea
          :maxlength="300"
          :rows="4"
          style="resize: none"
          v-model:value="formState.description"
          :showCount="true"
        />
      </a-form-item>
      <a-form-item :wrapperCol="{ offset: 9, span: 8 }">
        <a-button type="primary" size="large" @click="handleCreateClub"
          >Create a club</a-button
        >
      </a-form-item>
    </a-form>
  </div>
</template>
<style lang="less">
.create_club_container {
  width: 700px;
  height: 450px;
  background-color: white;
  padding: 20px;
  margin: auto;
  border-radius: 20px;
}
</style>
