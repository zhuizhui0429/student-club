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
  ToolOutlined,
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
  EmailReceiveConfig,
  updateEmailReceiveConfig,
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
      "/clubSquare": { title: "club square" },
      "/personalCenter": { title: "personal center" },
      "/publishActivity": { title: "release activity", subMenuKey: "myClub" },
      "/manageClubMember": { title: "management member", subMenuKey: "myClub" },
      "/activityHistory": {
        title: "historical activities",
        subMenuKey: "myClub",
      },
      "/createClub": { title: "new club" },
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

    const emailConfig = ref<EmailReceiveConfig>(userStore.emailReceiveConfig);
    const handleEmailConfigChange = (e: any) => {
      const config = e.target.value as EmailReceiveConfig;
      updateEmailReceiveConfig(userStore.id, config);
    };
    const textMap: Record<EmailReceiveConfig, string> = {
      both: "accept all notifications",
      onlyUpdate: "Receive notifications only for event updates",
      onlyPublish: "Receive notifications only for event postings",
      none: "do not accept any notice",
    };

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
      emailConfig,
      textMap,
      handleEmailConfigChange,
    };
  },
  components: {
    BellOutlined,
    PoweroffOutlined,
    BarsOutlined,
    BankOutlined,
    MailOutlined,
    UserOutlined,
    ToolOutlined,
    MyMessage,
  },
});
</script>

<template>
  <div class="homepage_container">
    <div class="sidebar_container">
      <div class="top">
        <BankOutlined style="fontsize: 20px; color: white" />
        <span class="title">Student Club Social System</span>
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
          club square
        </a-menu-item>
        <a-menu-item
          key="/personalCenter"
          v-if="['student', 'manager'].includes(type)"
        >
          <template #icon>
            <UserOutlined />
          </template>
          personal center
        </a-menu-item>
        <a-sub-menu key="myClub" v-if="type === 'manager'">
          <template #icon>
            <UserOutlined />
          </template>
          <template #title>my club</template>
          <a-menu-item key="/publishActivity">release activity</a-menu-item>
          <a-menu-item key="/manageClubMember">management member</a-menu-item>
          <a-menu-item key="/activityHistory"
            >historical activities</a-menu-item
          >
        </a-sub-menu>
        <a-menu-item key="/createClub" v-if="type === 'admin'">
          <template #icon>
            <UserOutlined />
          </template>
          new club
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
              overlayClassName="email_setting_popover"
              :mouseLeaveDelay="0.5"
              color="#dcebe4"
              trigger="click"
            >
              <template #title>Email Notification Settings</template>
              <template #content>
                <div class="email_setting_content">
                  <a-radio-group
                    v-model:value="emailConfig"
                    @change="handleEmailConfigChange"
                  >
                    <a-radio
                      v-for="config in Object.keys(textMap)"
                      :value="config"
                      :key="config"
                      >{{ textMap[config] }}</a-radio
                    >
                  </a-radio-group>
                </div>
              </template>
              <div class="email_setting_icon">
                <ToolOutlined
                  @click="viewMessageHandler"
                  style="font-size: 24px"
                />
              </div>
            </a-popover>
            <a-popover
              overlayClassName="message_popover"
              :mouseLeaveDelay="0.5"
              color="#dcebe4"
              trigger="click"
            >
              <template #title>my messages</template>
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
            <span class="account_info">Welcome back,{{ name }}</span>
            <div class="divider"></div>
            <a-popconfirm
              title="Are you sure to log out?"
              ok-text="quit"
              cancel-text="cancel"
              @confirm="handleExit"
              placement="left"
            >
              <div class="exit">
                <PoweroffOutlined style="fontsize: 16px; margin: 0px 10px" />
                <span>quit</span>
              </div>
            </a-popconfirm>
          </template>
          <p class="un_login" @click="navigateToLogin" v-else>
            Currently not logged in, please log
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
        width: 500px;
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
.email_setting_popover,
.message_popover {
  .ant-popover-arrow::before {
    background-color: #dcebe4;
  }
}

.email_setting_icon {
  width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.email_setting_content {
  width: 400px;
  height: 100px;
}
</style>
