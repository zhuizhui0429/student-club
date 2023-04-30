<script lang="ts">
export default {
  name: "ActivityForm",
};
</script>
<script setup lang="ts">
import EditUserInfo from "@/components/editUserInfo.vue";
import { RuleObject } from "ant-design-vue/es/form/interface";
import { FormExpose } from "ant-design-vue/es/form/Form";
import { reactive, ref, watch } from "vue";
import AvatarUpload from "@comp/avatarUpload.vue";
import { entryConditions } from "@const";
import type { CreateActivityPayload } from "@api";

export interface ActivityFormPropsType {
  type: "publish" | "update";
  initialValue?: CreateActivityPayload;
}

const emit = defineEmits<{
  (e: "submit", formState: CreateActivityPayload): void;
}>();
const props = withDefaults(defineProps<ActivityFormPropsType>(), {
  type: "publish",
});

const formRef = ref<FormExpose>({} as any);
const formState = reactive<CreateActivityPayload>(
  props.initialValue ? props.initialValue : ({} as CreateActivityPayload)
);
watch(
  () => props.initialValue,
  (newValue) => {
    const compose = { ...formState, ...newValue! };
    Object.keys(compose).forEach((key) => {
      (formState as Record<string, any>)[key] =
        compose[key as keyof CreateActivityPayload];
    });
  }
);

const labelCol = { span: 4 };
const wrapperCol = { span: 14, offset: 2 };

const rules: Record<keyof CreateActivityPayload, RuleObject | RuleObject[]> = {
  poster: { required: true, message: "请上传活动的海报图" },
  title: [
    {
      required: true,
      message: "请填写活动名称",
      trigger: "blur",
    },
    {
      min: 2,
      max: 20,
      message: "活动名称的长度应该在2~20位之间",
      trigger: "change",
    },
  ],
  location: {
    required: true,
    message: "请填写活动地点",
    trigger: "blur",
  },
  entryCondition: { required: true, message: "请设置活动的入场条件" },
  description: [
    {
      required: true,
      message: "请填写活动的详情信息",
      trigger: "blur",
    },
    {
      min: 10,
      max: 300,
      message: "活动的详情信息字数应该在10~300之间",
      trigger: "change",
    },
  ],
};

const handlePublishActivity = () => {
  formRef.value
    .validateFields()
    .then((res) => {
      emit("submit", res as CreateActivityPayload);
    })
    .catch((err) => console.log("err", err));
};
</script>

<template>
  <div class="activity_form_container">
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
    >
      <a-form-item label="活动海报" name="poster">
        <AvatarUpload
          v-model:avatarFile="formState.poster"
          :initialAvatar="formState.poster"
        />
      </a-form-item>
      <a-form-item label="活动名称" name="title">
        <a-input v-model:value="formState.title" placeholder="请输入活动名称" />
      </a-form-item>
      <a-form-item label="举办地点" name="location">
        <a-input
          v-model:value="formState.location"
          placeholder="请输入活动地点"
        />
      </a-form-item>
      <a-form-item label="入场条件" name="entryCondition">
        <a-select
          v-model:value="formState.entryCondition"
          placeholder="请选择入场条件"
        >
          <a-select-option
            v-for="condition in entryConditions"
            :key="condition"
            :value="condition"
            >{{ condition }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item label="活动介绍" name="description">
        <a-textarea
          :maxlength="300"
          :rows="4"
          style="resize: none"
          v-model:value="formState.description"
          :showCount="true"
        />
      </a-form-item>
      <a-form-item :wrapperCol="{ offset: 9, span: 8 }">
        <a-button type="primary" size="large" @click="handlePublishActivity"
          >{{ type === "publish" ? "发布" : "更新" }}活动</a-button
        >
      </a-form-item>
    </a-form>
  </div>
</template>

<style lang="less" scoped>
.activity_form_container {
  width: 700px;
  height: 450px;
  background-color: white;
  padding: 20px;
  margin: auto;
  border-radius: 20px;
}
</style>
