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

interface PrivateMessageFormState {
  title: string;
  content: string;
}

interface ClubMemberTableRecordType
  extends Omit<MemberOfClub, "name" | "avatar"> {
  member: {
    name: string;
    avatar: string;
  };
}

const data = ref<ClubMemberTableRecordType[]>([]);
const loadingData = ref<boolean>(true);
onMounted(() => {
  getAllMembersOfClub(1).then((res) => {
    data.value = res.data.data.map(({ name, avatar, ...rest }) => ({
      ...rest,
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
    title: "成员",
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
    title: "年级",
    dataIndex: "grade",
    key: "grade",
    width: 120,
  },
  {
    title: "学院",
    dataIndex: "college",
    key: "college",
    width: 160,
  },
  {
    title: "已加入天数",
    dataIndex: "joinDays",
    key: "joinDays",
    width: 120,
  },
  {
    title: "操作",
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
const formState = reactive<PrivateMessageFormState>({
  title: "",
  content: "",
});
const rules: Record<keyof PrivateMessageFormState, RuleObject> = {
  title: { required: true, message: "请输入私发消息的标题" },

  content: { required: true, message: "请输入私发消息的内容" },
};
const handleSendMessage = () => {
  formRef.value.validateFields().then(
    (res) => {
      console.log("发送消息", res);
      console.log("接受者id", sendedMessageMemberId.value);
    },
    (err) => console.log("err", err)
  );
};

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
          :placeholder="`搜索 ${column.title}`"
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
          搜索
        </a-button>
        <a-button
          size="small"
          style="width: 90px"
          @click="handleReset(clearFilters)"
        >
          清空
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
            @click="
              (sendPrivateMessageModalOpen = true) &&
                (sendedMessageMemberId = record.id)
            "
            style="margin-right: 10px"
            type="primary"
            >私发更新</a-button
          >
          <a-button danger @click="handleKickBtnClick(record)"
            >踢出俱乐部</a-button
          >
        </div>
        <span v-else>{{ text }}</span>
      </template>
    </template>
  </a-table>
  <a-modal
    title="私发成员更新"
    v-model:open="sendPrivateMessageModalOpen"
    :footer="null"
  >
    <a-form
      :rules="rules"
      :model="formState"
      ref="formRef"
      :labelCol="{ span: 4 }"
    >
      <a-form-item label="昵称" name="title">
        <a-input v-model:value="formState.title" placeholder="请输入消息标题" />
      </a-form-item>
      <a-form-item label="个人简介" name="content">
        <a-textarea
          v-model:value="formState.content"
          placeholder="请输入消息内容"
          :rows="3"
          style="resize: none"
        />
      </a-form-item>
      <a-form-item :wrapperCol="{ offset: 10 }">
        <a-button type="primary" @click="handleSendMessage">发送消息</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
  <a-modal
    v-model:open="kickMemberModalOpen"
    :title="`你确定要将成员${kickedMemberInfo.name}踢出俱乐部吗?`"
    @ok="handleKickMember"
    okType="danger"
  >
    <ExclamationCircleOutlined
      style="font-size: 20px; color: red; margin-right: 5px"
    />
    <span>请谨慎考虑</span>
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
