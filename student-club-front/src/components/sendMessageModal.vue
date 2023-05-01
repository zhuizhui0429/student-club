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
  joinClubApplication: "申请加入俱乐部",
  joinClubRefuse: "拒绝了你的入部申请",
  private: "私发更新消息",
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
  title: { required: true, message: "请输入私发消息的标题" },
  content: { required: true, message: "请输入私发消息的内容" },
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
      <a-form-item label="消息标题" name="title">
        <a-input v-model:value="formState.title" disabled />
      </a-form-item>
      <a-form-item label="消息内容" name="content">
        <a-textarea
          v-model:value="formState.content"
          placeholder="请输入申请信息"
          :rows="3"
          style="resize: none"
        />
      </a-form-item>
      <a-form-item :wrapperCol="{ offset: 10 }">
        <a-button type="primary" @click="handleSendMessage">发送消息</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style lang="less" scoped></style>
