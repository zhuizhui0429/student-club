<script lang="ts">
export default {
  name: "PublishActivity",
};
</script>
<script setup lang="ts">
import ActivityForm from "@/components/activityForm.vue";
import { CreateActivityPayload, createActivity } from "@api";
import { useUserStore } from "@store";

const userStore = useUserStore();

const handlePublish = (state: CreateActivityPayload) => {
  createActivity(state, userStore.id);
};
</script>

<template>
  <ActivityForm type="publish" @submit="handlePublish" />
</template>

<style lang="less" scoped>
.activity_form_container {
  width: 700px;
  height: 450px;
  background-color: white;
  padding: 40px;
  margin: auto;
  border-radius: 20px;
}
</style>
