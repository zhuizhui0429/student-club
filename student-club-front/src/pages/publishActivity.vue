<script lang="ts">
export default {
  name: "PublishActivity",
};
</script>
<script setup lang="ts">
import ActivityForm from "@/components/activityForm.vue";
import type { ActivityFormStateType } from "@api";

const handlePublish = (state: ActivityFormStateType) => {
  console.log("发布活动", state);
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
