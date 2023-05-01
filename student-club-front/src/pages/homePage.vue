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
import {
  getAllMessage,
  MessageResType as MessageItemType,
  updateLastReadTime,
} from "@api";

export default defineComponent({
  setup() {
    const userStore = useUserStore();
    const router = useRouter();
    const { type, avatar, name, isLogin } = storeToRefs(userStore);

    const messages = ref<MessageItemType[]>([]);
    const hasViewedMessage = ref<boolean>(false);
    const neverReadMessageCount = computed(
      () => messages.value.filter((it) => !it.hasRead).length
    );

    onMounted(() => {
      if (userStore.isLogin) {
        getAllMessage(userStore.id).then((res) => {
          messages.value = res.data.data;
        });
      }
    });

    const viewMessageHandler = () => {
      hasViewedMessage.value = true;
      updateLastReadTime(userStore.id);
    };

    const map: Record<string, { title: string; subMenuKey?: string }> = {
      "/clubSquare": { title: "俱乐部广场" },
      "/personalCenter": { title: "个人中心" },
      "/publishActivity": { title: "发布活动", subMenuKey: "myClub" },
      "/manageClubMember": { title: "管理成员", subMenuKey: "myClub" },
      "/activityHistory": { title: "历史活动", subMenuKey: "myClub" },
      "/createClub": { title: "新增俱乐部" },
    };
    const paths = Object.keys(map);
    const menuState = reactive<MenuProps>({
      theme: "dark",
      selectedKeys: [
        paths.includes(location.pathname) ? location.pathname : "/clubSquare",
      ],
      openKeys: (() => {
        const targetKeys: string[] = [];
        const initialPathname = location.pathname;
        for (const path of paths) {
          if (path === initialPathname && map[path].subMenuKey) {
            targetKeys.push(map[path].subMenuKey!);
          }
        }
        return targetKeys;
      })(),
    });
    const selectedMenuItemTitle = computed(
      () => map[menuState.selectedKeys![0]].title
    );

    const handleClickMenuItem: MenuProps["onClick"] = (data) => {
      const { key } = data;
      router.push(key as string);
    };

    const handleExit = () => {
      userStore.exitLogin();
      location.reload();
    };

    const navigateToLogin = () => router.push({ name: "login" });
    return {
      ...toRefs(menuState),
      handleClickMenuItem,
      type,
      selectedMenuItemTitle,
      messages,
      neverReadMessageCount,
      hasViewedMessage,
      name,
      avatar,
      handleExit,
      isLogin,
      navigateToLogin,
      viewMessageHandler,
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
        <a-menu-item
          key="/personalCenter"
          v-if="['student', 'manager'].includes(type)"
        >
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
          <a-menu-item key="/activityHistory">历史活动</a-menu-item>
        </a-sub-menu>
        <a-menu-item key="/createClub" v-if="type === 'admin'">
          <template #icon>
            <UserOutlined />
          </template>
          新增俱乐部
        </a-menu-item>
      </a-menu>
    </div>
    <div class="right">
      <div class="top_area">
        <div class="left_nav">
          <BarsOutlined style="fontsize: 16px" />
          <span>{{ selectedMenuItemTitle }}</span>
        </div>
        <div class="right_operation">
          <template v-if="isLogin">
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
                  @click="viewMessageHandler"
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
            <img :src="avatar" alt="" />
            <span class="account_info">欢迎回来，{{ name }}</span>
            <div class="divider"></div>
            <a-popconfirm
              title="你确定退出登录吗？"
              ok-text="退出"
              cancel-text="取消"
              @confirm="handleExit"
              placement="left"
            >
              <div class="exit">
                <PoweroffOutlined style="fontsize: 16px; margin: 0px 10px" />
                <span>退出</span>
              </div>
            </a-popconfirm>
          </template>
          <p class="un_login" @click="navigateToLogin" v-else>
            当前暂未登录,请尽快登录
          </p>
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
        .exit {
          cursor: pointer;
        }
        .account_info {
          color: rgb(169, 171, 179);
          font-size: 14px;
        }
        .un_login {
          cursor: pointer;
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
