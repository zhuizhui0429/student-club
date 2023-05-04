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
  poster: { required: true, message: "Please upload a poster" },
  title: [
    {
      required: true,
      message: "Please fill in the event name",
      trigger: "blur",
    },
    {
      min: 2,
      max: 20,
      message:
        "The length of the activity name should be between 2 and 20 characters",
      trigger: "change",
    },
  ],
  location: {
    required: true,
    message: "Please fill in the event location",
    trigger: "blur",
  },
  entryCondition: {
    required: true,
    message: "Please set the entry conditions for the event",
  },
  description: [
    {
      required: true,
      message: "Please fill in the details of the event",
      trigger: "blur",
    },
    {
      min: 10,
      max: 300,
      message:
        "The number of words for the detailed information of the event should be between 10 and 300",
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
      <a-form-item label="event poster" name="poster">
        <AvatarUpload
          v-model:avatarFile="formState.poster"
          :initialAvatar="formState.poster"
        />
      </a-form-item>
      <a-form-item label="Event name" name="title">
        <a-input
          v-model:value="formState.title"
          placeholder="Please enter event name"
        />
      </a-form-item>
      <a-form-item label="Venue" name="location">
        <a-input
          v-model:value="formState.location"
          placeholder="Please enter event location"
        />
      </a-form-item>
      <a-form-item label="Entry condition" name="entryCondition">
        <a-select
          v-model:value="formState.entryCondition"
          placeholder="Entry conditions"
        >
          <a-select-option
            v-for="condition in entryConditions"
            :key="condition"
            :value="condition"
            >{{ condition }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item label="activity description" name="description">
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
          >{{ type === "publish" ? "release" : "update" }}event</a-button
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
