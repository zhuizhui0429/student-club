<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, h } from "vue";
import {
  PoweroffOutlined,
  CarryOutOutlined,
  TeamOutlined,
  AliwangwangOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  SmileOutlined,
} from "@ant-design/icons-vue";
import { notification } from "ant-design-vue";
import { getUserHasJoinedClubList, UserHasJoinedClubPreviewType } from "@api";
import EditUserInfo from "@/components/editUserInfo.vue";

export default defineComponent({
  setup() {
    const joinedClubList = ref<UserHasJoinedClubPreviewType[]>([]);
    const modalVisible = ref<boolean>(false);
    const editFormVisible = ref<boolean>(false);
    let hasTiped = false;

    const scollXTip = () => {
      if (hasTiped) {
        return;
      }
      notification.open({
        duration: 5,
        message: "温馨提示",
        description:
          "可同时按住shift并且滚动滑轮以横向移动查看您参加的所有俱乐部",
        icon: h(SmileOutlined, { style: { color: "#108ee9" } }),
      });
      hasTiped = true;
    };

    onMounted(() => {
      getUserHasJoinedClubList(1).then((res) => {
        joinedClubList.value = res;
      });
      window.addEventListener("wheel", scollXTip);
    });

    onUnmounted(() => window.removeEventListener("wheel", scollXTip));

    return {
      joinedClubList,
      modalVisible,
      editFormVisible,
    };
  },
  components: {
    PoweroffOutlined,
    CarryOutOutlined,
    TeamOutlined,
    AliwangwangOutlined,
    ExclamationCircleOutlined,
    WarningOutlined,
    EditUserInfo,
  },
});
</script>

<template>
  <div class="personal_center_container">
    <div class="info">
      <div class="account_info">
        <p class="title">账号信息</p>
        <div class="content">
          <div class="top">
            <img
              src="https://img0.baidu.com/it/u=1993557595,4075530522&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1682614800&t=1cbe6bfaabf65fccdec346c8fc9c8fb6"
              alt=""
            />
            <div class="nickname_id">
              <p class="nickname">追追</p>
              <p class="id">学号: 201905556821</p>
            </div>
          </div>
        </div>
      </div>
      <div class="joined_club">
        <p class="title">已加入的俱乐部</p>
        <div class="club_list">
          <div
            class="club_item"
            v-for="club in joinedClubList"
            :key="club.clubId"
          >
            <img :src="club.poster" alt="" />
            <p class="club_name">{{ club.clubName }}</p>
            <p class="member_count">{{ club.memberCount }}成员</p>
            <a-button
              danger
              type="default"
              size="small"
              @click="modalVisible = true"
            >
              <template #icon>
                <ExclamationCircleOutlined />
              </template>
              退部
            </a-button>
          </div>
        </div>
      </div>
      <a-modal v-model:open="modalVisible" title="确认要退出该俱乐部吗？">
        <div class="exit_club_modal_content">
          <WarningOutlined />
          <p>请确认是否是误触操作，这将会导致你永久退出该俱乐部</p>
        </div>
      </a-modal>
    </div>
    <div class="count_data">
      <div class="item">
        <div class="icon_wrapper">
          <CarryOutOutlined style="font-size: 24px; color: #ffbb38" />
        </div>
        <div class="right">
          <p class="name">我的年级</p>
          大三
        </div>
      </div>
      <div class="item">
        <div class="icon_wrapper">
          <TeamOutlined style="font-size: 24px; color: #396aff" />
        </div>
        <div class="right">
          <p class="name">我的学院</p>
          计网院
        </div>
      </div>
      <div class="item">
        <div class="icon_wrapper">
          <AliwangwangOutlined style="font-size: 24px; color: #4c78ff" />
        </div>
        <div class="right">
          <p class="name">已加入的俱乐部数</p>
          6
        </div>
      </div>
      <div class="item">
        <div class="icon_wrapper">
          <PoweroffOutlined style="font-size: 24px; color: #ff82ac" />
        </div>

        <div class="right">
          <p class="name">我的学院</p>
          计网院
        </div>
      </div>
    </div>

    <div class="edit_btn">
      <a-button type="primary" size="large" @click="editFormVisible = true"
        >编辑个人信息</a-button
      >
    </div>
    <a-modal title="更新个人信息" :footer="null" v-model:open="editFormVisible">
      <EditUserInfo />
    </a-modal>
  </div>
</template>

<style lang="less" scoped>
.personal_center_container {
  min-height: calc(100vh - 180px);
  position: relative;
  .count_data {
    display: flex;
    justify-content: space-between;
    .item {
      width: 260px;
      height: 120px;
      background-color: white;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      .icon_wrapper {
        width: 70px;
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
      }
      .right {
        margin-left: 15px;
        color: rgb(80, 88, 135);
        font-weight: bold;
        p {
          margin-bottom: 15px;
          color: rgb(113, 142, 191);
          font-size: 14px;
        }
      }
    }
    .item:nth-child(1) .icon_wrapper {
      background-color: #fff5d9;
    }
    .item:nth-child(2) .icon_wrapper {
      background-color: #e7edff;
    }
    .item:nth-child(3) .icon_wrapper {
      background-color: lightpink;
    }
    .item:nth-child(4) .icon_wrapper {
      background-color: lightsteelblue;
    }
  }
  .info {
    width: 100%;
    display: flex;
    height: 330px;
    box-sizing: border-box;
    margin-bottom: 20px;
    .title {
      color: rgb(51, 59, 105);
      font-size: 22px;
      font-weight: bold;
      line-height: 50px;
    }
    .account_info {
      margin-right: 60px;
      width: 350px;
      flex: 0 0 auto;
      .content {
        height: 260px;
        border-radius: 10px;
        background-color: #e7edff;
        box-sizing: border-box;
        padding-top: 20px;
        padding-left: 10px;
        .top {
          display: flex;
          height: 100;
          align-items: center;
          img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            object-fit: cover;
            margin-right: 10px;
          }
          .nickname_id {
            .nickname {
              font-weight: bold;
              margin-block: 6px;
            }
            .id {
              font-size: 14px;
            }
          }
        }
      }
    }
    .joined_club {
      flex: 1 1 auto;
      .club_list {
        height: 260px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        overflow-x: scroll;
        box-sizing: border-box;
        padding: 0px 30px;
        border: 2px solid lightslategrey;
        max-width: 700px;
        .club_item {
          height: 200px;
          flex: 0 0 140px;
          background-color: lightslategray;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin-right: 20px;
          img {
            width: 60px;
            height: 60px;
            border-radius: 50%;
          }
          .club_name {
            font-weight: bold;
            margin-top: 8px;
            margin-bottom: 8px;
            color: white;
          }
          .member_count {
            font-size: 12px;
            color: #ddd;
            margin-bottom: 8px;
          }
        }
      }
    }
  }
  .edit_btn {
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>

<style lang="less">
.exit_club_modal_content {
  display: flex;
  align-items: center;
  p {
    margin-left: 10px;
  }
}
</style>
