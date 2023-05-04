<script lang="ts">
export default {
  name: "SendMessageModal",
};
</script>

<script lang="ts" setup>
import type { MessageType } from "@api";
import { sendMessage } from "@api";
import { toRefs, reactive, ref, defineProps, watch } from "vue";
import { RuleObject } from "ant-design-vue/es/form/interface";
import { FormExpose } from "ant-design-vue/es/form/Form";
import { useUserStore } from "@store";

interface SendMessageFormState {
  title: string;
  content: string;
}

defineEmits<{
  onModalClose: void;
}>();

const props = defineProps<{
  type: MessageType;
  targetId: number;
  open: boolean;
}>();

const { type, targetId, open } = toRefs(props);

const modalVisible = ref<boolean>(open.value);

watch(open, () => {
  modalVisible.value = open.value;
});

const titleMap: Partial<Record<MessageType, string>> = {
  joinClubApplication: "apply to join the club",
  joinClubRefuse:
    "Your application for admission to the Ministry has been rejected",
  private: "Private update message",
};

const formRef = ref<FormExpose>({} as any);
const formState = reactive<SendMessageFormState>({
  title: "",
  content: "",
});

watch(
  type,
  () => {
    formState.title = titleMap[type.value]!;
  },
  { immediate: true }
);

const rules: Record<keyof SendMessageFormState, RuleObject> = {
  title: {
    required: true,
    message: "Please enter the title of the private message",
  },
  content: {
    required: true,
    message: "Please enter the content of the private message",
  },
};

const userStore = useUserStore();

const handleSendMessage = () => {
  formRef.value
    .validateFields()
    .then(
      async (res) => {
        const { title, content } = res as SendMessageFormState;
        const {
          id: senderId,
          avatar: senderAvatar,
          name: senderName,
        } = userStore;
        await sendMessage({
          senderAvatar,
          senderId,
          senderName,
          title,
          content,
          targetId: targetId.value,
          type: type.value,
        });
      },
      (err) => console.log("err", err)
    )
    .finally(() => (open.value = false));
};
</script>

<template>
  <a-modal
    :title="titleMap[type]"
    v-model:open="modalVisible"
    :footer="null"
    @cancel="$emit('onModalClose')"
  >
    <a-form
      :rules="rules"
      :model="formState"
      ref="formRef"
      :labelCol="{ span: 4 }"
    >
      <a-form-item label="title" name="title">
        <a-input v-model:value="formState.title" disabled />
      </a-form-item>
      <a-form-item label="content" name="content">
        <a-textarea
          v-model:value="formState.content"
          placeholder="please enter content"
          :rows="3"
          style="resize: none"
        />
      </a-form-item>
      <a-form-item :wrapperCol="{ offset: 10 }">
        <a-button type="primary" @click="handleSendMessage"
          >Send a message</a-button
        >
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style lang="less" scoped></style>
