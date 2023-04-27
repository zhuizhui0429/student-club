<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  computed,
  ref,
  onMounted,
} from "vue";
import {
  BellOutlined,
  PoweroffOutlined,
  BarsOutlined,
  BankOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons-vue";
import type { MenuProps } from "ant-design-vue/es/menu/src/Menu";
import { useRouter } from "vue-router";
import { useUserStore } from "@store";
import { storeToRefs } from "pinia";
import MyMessage from "@/components/myMessage.vue";
import { getAllMessage, MessageItemType } from "@api";

export default defineComponent({
  setup() {
    const userStore = useUserStore();
    const router = useRouter();
    const { type } = storeToRefs(userStore);

    const messages = ref<MessageItemType[]>([]);
    const hasViewedMessage = ref<boolean>(false);
    const neverReadMessageCount = computed(
      () => messages.value.filter((it) => !it.hasRead).length
    );

    onMounted(() => {
      getAllMessage(1).then((res) => {
        messages.value = res;
      });
    });

    const map: Record<string, string> = {
      "/clubSquare": "俱乐部广场",
      "/personalCenter": "个人中心",
      "/publishActivity": "发布活动",
      "/manageClubMember": "管理成员",
      "/createClub": "新增俱乐部",
    };
    const menuState = reactive<MenuProps>({
      theme: "dark",
      selectedKeys: [
        Object.keys(map).includes(location.pathname)
          ? location.pathname
          : "/clubSquare",
      ],
      openKeys: [""],
    });
    const selectedMenuItemTitle = computed(
      () => map[menuState.selectedKeys![0]]
    );

    const handleClickMenuItem: MenuProps["onClick"] = (data) => {
      const { key } = data;
      router.push(key as string);
    };

    return {
      ...toRefs(menuState),
      handleClickMenuItem,
      type,
      selectedMenuItemTitle,
      messages,
      neverReadMessageCount,
      hasViewedMessage,
    };
  },
  components: {
    BellOutlined,
    PoweroffOutlined,
    BarsOutlined,
    BankOutlined,
    MailOutlined,
    UserOutlined,
    MyMessage,
  },
});
</script>

<template>
  <div class="homepage_container">
    <div class="sidebar_container">
      <div class="top">
        <BankOutlined style="fontsize: 20px; color: white" />
        <span class="title">学生俱乐部社交系统</span>
      </div>
      <a-menu
        @click="handleClickMenuItem"
        style="width: 256px"
        v-model:openKeys="openKeys"
        v-model:selectedKeys="selectedKeys"
        mode="inline"
        theme="dark"
      >
        <a-menu-item key="/clubSquare">
          <template #icon>
            <MailOutlined />
          </template>
          俱乐部广场
        </a-menu-item>
        <a-menu-item key="/personalCenter">
          <template #icon>
            <UserOutlined />
          </template>
          个人中心
        </a-menu-item>
        <a-sub-menu key="myClub" v-if="type === 'manager'">
          <template #icon>
            <UserOutlined />
          </template>
          <template #title>我的俱乐部</template>
          <a-menu-item key="/publishActivity">发布活动</a-menu-item>
          <a-menu-item key="/manageClubMember">管理成员</a-menu-item>
          <a-menu-item key="/createClub">新增俱乐部</a-menu-item>
        </a-sub-menu>
      </a-menu>
    </div>
    <div class="right">
      <div class="top_area">
        <div class="left_nav">
          <BarsOutlined style="fontsize: 16px" />
          <span>{{ selectedMenuItemTitle }}</span>
        </div>
        <div class="right_operation">
          <a-popover
            overlayClassName="message_popover"
            :mouseLeaveDelay="0.5"
            color="#dcebe4"
            trigger="click"
          >
            <template #title>我的消息</template>
            <template #content>
              <MyMessage :messageList="messages" />
            </template>
            <div class="message_tip_area">
              <BellOutlined
                @click="hasViewedMessage = true"
                style="font-size: 24px"
              />
              <p
                class="new_message_count"
                v-show="neverReadMessageCount && !hasViewedMessage"
              >
                {{ neverReadMessageCount }}
              </p>
            </div>
          </a-popover>
          <img
            src="https://img2.baidu.com/it/u=2421090168,324781765&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1682528400&t=73951dea4039e6f2e68d5805f96c4adf"
            alt=""
          />
          <span class="account_info">学生:201905556821</span>
          <div class="divider"></div>
          <PoweroffOutlined style="fontsize: 16px; margin: 0px 10px" />
          <span>推出</span>
        </div>
      </div>
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.homepage_container {
  width: 100vw;
  height: 100vh;
  display: flex;
  .sidebar_container {
    width: 256px;
    height: 100vh;
    flex: 0 0 auto;
    background-color: #001529;
    .top {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      .title {
        margin-left: 5px;
        font-size: 18px;
        color: rgb(169, 171, 179);
      }
    }
  }
  .right {
    flex: 1 1 auto;
    overflow-y: scroll;
    .top_area {
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      padding: 0px 40px;
      .left_nav {
        span {
          margin-left: 10px;
        }
      }
      .right_operation {
        width: 400px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .message_tip_area {
          position: relative;
          cursor: pointer;
          .new_message_count {
            position: absolute;
            top: 0;
            right: 0;
            transform: translate(15px, -8px);
            background-color: red;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            text-align: center;
            line-height: 20px;
            font-size: 12px;
            color: white;
          }
        }
        img {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          object-fit: cover;
          margin: 0px 16px;
          margin-left: 25px;
        }
        .divider {
          height: 18px;
          width: 1px;
          background-color: #d8d8d8;
          margin: 0px 20px;
        }
        .account_info {
          color: rgb(169, 171, 179);
          font-size: 14px;
        }
      }
    }
    .content {
      box-sizing: border-box;
      padding: 20px 40px;
      min-height: calc(100vh - 100px);
      background-color: #dcebe4;
    }
  }
}
</style>

<style lang="less">
.message_popover {
  .ant-popover-arrow::before {
    background-color: #dcebe4;
  }
}
</style>
