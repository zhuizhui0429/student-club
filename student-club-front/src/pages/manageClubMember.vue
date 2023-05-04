<script lang="ts">
export default {
  name: "ManageClubMember",
};
</script>

<script setup lang="ts">
import {
  SearchOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons-vue";
import { reactive, ref, toRefs, onMounted } from "vue";
import type { ColumnsType } from "ant-design-vue/es/table/Table";
import type { FilterDropdownProps } from "ant-design-vue/es/table/interface";
import { MemberOfClub, getAllMembersOfClub } from "@api";
import { RuleObject } from "ant-design-vue/es/form/interface";
import { FormExpose } from "ant-design-vue/es/form/Form";
import SendMessageModal from "@/components/sendMessageModal.vue";
import { useUserStore } from "@store";

interface ClubMemberTableRecordType
  extends Omit<MemberOfClub, "name" | "avatar"> {
  member: {
    name: string;
    avatar: string;
  };
}

const data = ref<ClubMemberTableRecordType[]>([]);
const loadingData = ref<boolean>(true);
const userStore = useUserStore();
onMounted(() => {
  getAllMembersOfClub(userStore.id).then((res) => {
    data.value = res.data.data.map(({ name, avatar, ...rest }) => ({
      ...rest,
      joinDays: "100 days ago",
      member: { name, avatar },
    }));
    loadingData.value = false;
  });
});

const current = ref<number>(1);
const handlePageCurrentChange = (page: number, pageSize: number) => {
  console.log("切换到第", page, "页");
  current.value = page;
};

const state = reactive({
  searchText: "",
  searchedColumn: "",
});

const searchInput = ref();

const columns: ColumnsType<ClubMemberTableRecordType> = [
  {
    title: "member",
    dataIndex: "member",
    key: "member",
    customFilterDropdown: true,
    width: 200,
    onFilter: (value, record) => {
      return record.member.name
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase());
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => {
          searchInput.value.focus();
        }, 100);
      }
    },
  },
  {
    title: "grade",
    dataIndex: "grade",
    key: "grade",
    width: 120,
  },
  {
    title: "college",
    dataIndex: "college",
    key: "college",
    width: 160,
  },
  {
    title: "joinDays",
    dataIndex: "joinDays",
    key: "joinDays",
    width: 120,
  },
  {
    title: "operation",
    key: "operation",
  },
];

const handleSearch = (
  selectedKeys: string[],
  confirm: FilterDropdownProps<ClubMemberTableRecordType>["confirm"],
  dataIndex: string
) => {
  confirm();
  state.searchText = selectedKeys[0];
  state.searchedColumn = dataIndex;
};

const handleReset = (clearFilters: Function) => {
  clearFilters({ confirm: true });
  state.searchText = "";
};
const { searchedColumn, searchText } = toRefs(state);

const sendPrivateMessageModalOpen = ref<boolean>(false);
const formRef = ref<FormExpose>({} as any);
const sendedMessageMemberId = ref<number>(0);

const kickedMemberInfo = reactive({
  name: "",
  id: 0,
});
const kickMemberModalOpen = ref<boolean>(false);
const handleKickBtnClick = (record: ClubMemberTableRecordType) => {
  kickedMemberInfo.id = record.id;
  kickedMemberInfo.name = record.member.name;
  kickMemberModalOpen.value = true;
};
const handleKickMember = () => {
  console.log("踢出");
  //await
  setTimeout(() => {
    kickMemberModalOpen.value = false;
  }, 300);
};

const privateSendMessageTargetId = ref<number>(0);
const handlePrivateSendMessage = (targetId: number) => {
  sendPrivateMessageModalOpen.value = true;
  privateSendMessageTargetId.value = targetId;
};
</script>

<template>
  <a-table
    :data-source="data"
    :columns="columns"
    :loading="loadingData"
    :scroll="{ y: 450 }"
    :pagination="{
      total: data.length,
      pageSize: 10,
      showQuickJumper: true,
      onChange: handlePageCurrentChange,
    }"
  >
    <template #headerCell="{ column }">
      <span :style="column.key === 'socialInfo' ? `color:#108ee9` : ''">{{
        column.title
      }}</span>
    </template>
    <template
      #customFilterDropdown="{
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
        column,
      }"
    >
      <div style="padding: 8px">
        <a-input
          ref="searchInput"
          :placeholder="`search ${column.title}`"
          :value="selectedKeys[0]"
          style="width: 188px; margin-bottom: 8px; display: block"
          @change="
            (e) => setSelectedKeys(e.target.value ? [e.target.value] : [])
          "
          @pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)"
        />
        <a-button
          type="primary"
          size="small"
          style="width: 90px; margin-right: 8px"
          @click="handleSearch(selectedKeys, confirm, column.dataIndex)"
        >
          <template #icon><SearchOutlined /></template>
          search
        </a-button>
        <a-button
          size="small"
          style="width: 90px"
          @click="handleReset(clearFilters)"
        >
          reset
        </a-button>
      </div>
    </template>
    <template #customFilterIcon="{ filtered }">
      <search-outlined :style="{ color: filtered ? '#108ee9' : undefined }" />
    </template>
    <template #bodyCell="{ text, column, record }">
      <span v-if="searchText && searchedColumn === column.dataIndex">
        <div class="member_info_container" v-if="column.key === 'member'">
          <img :src="text.avatar" alt="" />
          <template
            v-for="(fragment, i) in text.name
              .toString()
              .split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
          >
            <mark
              v-if="fragment.toLowerCase() === searchText.toLowerCase()"
              :key="i"
              class="highlight"
            >
              {{ fragment }}
            </mark>
            <template v-else>{{ fragment }}</template>
          </template>
        </div>
        <template
          v-else
          v-for="(fragment, i) in text
            .toString()
            .split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
        >
          <mark
            v-if="fragment.toLowerCase() === searchText.toLowerCase()"
            :key="i"
            class="highlight"
          >
            {{ fragment }}
          </mark>
          <template v-else>{{ fragment }}</template>
        </template>
      </span>
      <template v-else>
        <div class="member_info_container" v-if="column.key === 'member'">
          <img :src="text.avatar" alt="" />
          <span>{{ text.name }}</span>
        </div>
        <div v-else-if="column.key === 'operation'" class="operation_container">
          <a-button
            @click="handlePrivateSendMessage(record.id)"
            style="margin-right: 10px"
            type="primary"
            >Private update</a-button
          >
          <a-button danger @click="handleKickBtnClick(record)"
            >kicked out</a-button
          >
        </div>
        <span v-else>{{ text }}</span>
      </template>
    </template>
  </a-table>
  <SendMessageModal
    :targetId="privateSendMessageTargetId"
    :open="sendPrivateMessageModalOpen"
    type="private"
    @onModalClose="sendPrivateMessageModalOpen = false"
  />
  <a-modal
    v-model:open="kickMemberModalOpen"
    :title="`Are you sure you want to assign members ${kickedMemberInfo.name} kicked out of the club?`"
    @ok="handleKickMember"
    okType="danger"
  >
    <ExclamationCircleOutlined
      style="font-size: 20px; color: red; margin-right: 5px"
    />
    <span>Please consider carefully</span>
  </a-modal>
</template>

<style lang="less" scoped>
.member_info_container {
  display: flex;
  align-items: center;
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 4px;
  }
}
</style>
