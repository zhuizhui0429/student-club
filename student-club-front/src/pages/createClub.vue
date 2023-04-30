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

const formRef = ref<FormExpose>({} as any);
const formState = reactive<ClubFormStateType>({} as any);
const rules: Record<keyof ClubFormStateType, RuleObject | RuleObject[]> = {
  poster: { required: true, message: "请上传活动的海报图" },
  clubName: [
    {
      required: true,
      message: "请填写俱乐部名称",
      trigger: "blur",
    },
    {
      min: 2,
      max: 20,
      message: "活动名称的长度应该在2~20位之间",
      trigger: "change",
    },
  ],
  managerId: { required: true, message: "请选择该俱乐部的经理" },
  description: [
    {
      required: true,
      message: "请填写俱乐部的简介",
      trigger: "blur",
    },
    {
      min: 10,
      max: 300,
      message: "俱乐部的简介字数应该在10~300之间",
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
      <a-form-item label="俱乐部头像" name="poster">
        <AvatarUpload
          v-model:avatarFile="formState.poster"
          :initialAvatar="formState.poster"
        />
      </a-form-item>
      <a-form-item label="俱乐部名称" name="clubName">
        <a-input
          v-model:value="formState.clubName"
          placeholder="请输入俱乐部名称"
        />
      </a-form-item>
      <a-form-item label="俱乐部经理" name="managerId">
        <a-select
          v-model:value="formState.managerId"
          placeholder="请选择新建俱乐部对应的经理"
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
      <a-form-item label="俱乐部简介" name="description">
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
          >创建俱乐部</a-button
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
