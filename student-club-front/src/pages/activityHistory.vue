<script lang="ts">
export default {
  name: "ActivityHistory",
};
</script>

<script setup lang="ts">
import type { ColumnsType } from "ant-design-vue/es/table/Table";
import {
  getAllActivitiesOfClub,
  UpdateActivityFormState,
  updateActivity,
  ActivityTableRecordType,
} from "@api";
import { ref, onMounted } from "vue";
import ActivityForm from "@/components/activityForm.vue";
import { useUserStore } from "@store";

const data = ref<ActivityTableRecordType[]>([]);
const loadingData = ref<boolean>(true);
const userStore = useUserStore();

const renderTable = () => {
  getAllActivitiesOfClub(userStore.id).then((res) => {
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
    title: "Event name",
    dataIndex: "titlePoster",
    key: "titlePoster",
    width: 240,
  },
  {
    title: "Activity introduction",
    dataIndex: "description",
    key: "description",
    ellipsis: true,
    width: 240,
  },
  {
    title: "Event Location",
    dataIndex: "location",
    key: "location",
    ellipsis: true,
  },
  {
    title: "Entry conditions",
    key: "entryCondition",
    dataIndex: "entryCondition",
    width: 100,
  },
  {
    title: "Date",
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
    title: "operation",
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
          >Update event
        </a-button>
      </div>
      <div class="activity_name" v-else-if="column.key === 'titlePoster'">
        <img :src="text.poster" alt="" />
        <p>{{ text.title }}</p>
      </div>
      <a-button
        @click="handleClickRsvpBtn(record.id)"
        v-else-if="column.key === 'rsvp'"
        >view rsvp</a-button
      >
    </template>
  </a-table>
  <a-modal
    v-model:open="ActivityFormModalOpen"
    title="Update event information"
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
