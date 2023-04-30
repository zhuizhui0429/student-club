<script lang="ts">
export default {
  name: "ActivityHistory",
};
</script>

<script setup lang="ts">
import type { ColumnsType } from "ant-design-vue/es/table/Table";
import {
  ActivityTableRecordType,
  getAllActivitiesOfClub,
  UpdateActivityFormState,
  updateActivity,
} from "@api";
import { ref, onMounted } from "vue";
import ActivityForm from "@/components/activityForm.vue";

const data = ref<ActivityTableRecordType[]>([]);
const loadingData = ref<boolean>(true);

const renderTable = () => {
  getAllActivitiesOfClub(1).then((res) => {
    data.value = res.data.data.map(({ title, poster, ...rest }) => ({
      ...rest,
      titlePoster: { title, poster },
    }));
    loadingData.value = false;
  });
};

onMounted(() => renderTable());

const columns: ColumnsType<ActivityTableRecordType> = [
  {
    title: "活动名称",
    dataIndex: "titlePoster",
    key: "titlePoster",
    width: 240,
  },
  {
    title: "活动简介",
    dataIndex: "description",
    key: "description",
    ellipsis: true,
    width: 240,
  },
  {
    title: "活动地点",
    dataIndex: "location",
    key: "location",
    ellipsis: true,
  },
  {
    title: "入场条件",
    key: "entryCondition",
    dataIndex: "entryCondition",
    width: 100,
  },
  {
    title: "举办日期",
    key: "date",
    dataIndex: "date",
    width: 120,
  },
  {
    title: "RSVP",
    key: "rsvp",
    dataIndex: "rsvp",
    width: 160,
  },
  {
    title: "操作",
    key: "operation",
    width: 200,
  },
];

const ActivityFormModalOpen = ref<boolean>(false);
const selectedActivityState = ref<UpdateActivityFormState>({} as any);
const handleClickUpdateBtn = (record: ActivityTableRecordType) => {
  const {
    titlePoster: { title, poster },
    location,
    description,
    entryCondition,
    id,
  } = record;
  selectedActivityState.value = {
    title,
    poster,
    location,
    description,
    entryCondition,
    id,
  };
  ActivityFormModalOpen.value = true;
  console.log("更新的活动", record);
};

const handleClickRsvpBtn = (activityId: number) => {
  console.log("待查看rsvp的活动id", activityId);
};

const updateActivityInfo = (newState: UpdateActivityFormState) => {
  updateActivity({ ...newState, id: selectedActivityState.value.id }).then(
    () => {
      renderTable();
    }
  );
};
</script>

<template>
  <a-table
    :columns="columns"
    :scroll="{ y: 450 }"
    :data-source="data"
    :loading="loadingData"
    :pagination="{
      total: data.length,
      pageSize: 10,
      showQuickJumper: true,
    }"
  >
    <template #bodyCell="{ record, column, text }">
      <div class="operation_area" v-if="column.key === 'operation'">
        <a-button type="primary" @click="handleClickUpdateBtn(record)"
          >更新活动信息</a-button
        >
      </div>
      <div class="activity_name" v-else-if="column.key === 'titlePoster'">
        <img :src="text.poster" alt="" />
        <p>{{ text.title }}</p>
      </div>
      <a-button
        @click="handleClickRsvpBtn(record.id)"
        v-else-if="column.key === 'rsvp'"
        >查看rsvp</a-button
      >
    </template>
  </a-table>
  <a-modal
    v-model:open="ActivityFormModalOpen"
    title="更新活动信息"
    :footer="null"
    width="848px"
    :bodyStyle="{ width: 800 }"
  >
    <ActivityForm
      type="update"
      :initialValue="selectedActivityState"
      @submit="updateActivityInfo"
    />
  </a-modal>
</template>

<style lang="less" scoped>
.activity_name {
  display: flex;
  align-items: center;
  img {
    width: 60px;
    height: 60px;
    border-radius: 10px;
    object-fit: cover;
    margin-right: 10px;
  }
}
</style>
