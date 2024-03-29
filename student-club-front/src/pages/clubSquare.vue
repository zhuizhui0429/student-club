<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import ClubCard from "@/components/clubCard.vue";
import ActivityCard from "@/components/activityCard.vue";
import Loading from "@/components/loading.vue";
import {
  getAllClubPreviewInfo,
  ClubPreviewType,
  getAllMembersByClubId,
  getAllActivitiesByClubId,
  MemberOfClub,
  ActivityOfClub,
  judgeIsJoinClub,
} from "@api";
import {
  PoweroffOutlined,
  CheckCircleTwoTone,
  SmileTwoTone,
} from "@ant-design/icons-vue";
import { useUserStore } from "@store";
import { storeToRefs } from "pinia";
import SendMessageModal from "@/components/sendMessageModal.vue";

export default defineComponent({
  setup() {
    const userStore = useUserStore();
    const { isLogin, type } = storeToRefs(userStore);
    const clubList = ref<ClubPreviewType[]>([]);
    const memberList = ref<MemberOfClub[]>([]);
    const activityList = ref<ActivityOfClub[]>([]);
    const clubDetailModalVisible = ref<boolean>(false);
    const hasJoined = ref<boolean>(false);
    const loadingClubList = ref<boolean>(true);
    const loadingClubDetail = ref<boolean>(true);
    let clickedClubManagerId = ref<number>(0);

    onMounted(() => {
      getAllClubPreviewInfo().then((res) => {
        clubList.value = res.data.data;
        loadingClubList.value = false;
      });
    });

    const handleClickClubCard = async (id: number, managerId: number) => {
      clickedClubManagerId.value = managerId;
      clubDetailModalVisible.value = true;
      loadingClubDetail.value = true;
      const [membersData, activitiesData, joinJudgeData] = await Promise.all([
        getAllMembersByClubId(id),
        getAllActivitiesByClubId(id),
        judgeIsJoinClub(userStore.id, id),
      ]);
      memberList.value = membersData.data.data;
      activityList.value = activitiesData.data.data;
      hasJoined.value = joinJudgeData.data.data;
      loadingClubDetail.value = false;
    };

    const sendMessageModalOpen = ref<boolean>(false);
    const onclose = () => {
      console.log("close");
      sendMessageModalOpen.value = false;
    };
    return {
      clubList,
      handleClickClubCard,
      clubDetailModalVisible,
      memberList,
      activityList,
      hasJoined,
      loadingClubList,
      loadingClubDetail,
      isLogin,
      type,
      sendMessageModalOpen,
      clickedClubManagerId,
      onclose,
    };
  },
  components: {
    PoweroffOutlined,
    CheckCircleTwoTone,
    SmileTwoTone,
    ClubCard,
    ActivityCard,
    Loading,
    SendMessageModal,
  },
});
</script>

<template>
  <div class="club_square_container">
    <div class="club_list" v-if="!loadingClubList">
      <ClubCard
        @viewClubDetail="handleClickClubCard"
        v-for="club in clubList"
        :key="club.clubId"
        v-bind="club"
      />
    </div>
    <div class="empty_club_list">
      <a-empty
        v-if="!clubList.length"
        description="暂无任何俱乐部,请联系管理员创建"
      />
    </div>
    <Loading
      size="large"
      :loading="loadingClubList"
      initialHeight="calc(100vh - 180px)"
    />
    <SendMessageModal
      type="joinClubApplication"
      :targetId="clickedClubManagerId"
      :open="sendMessageModalOpen"
      @onModalClose="sendMessageModalOpen = false"
    />
    <a-modal
      title="club detail"
      :width="848"
      :footer="null"
      v-model:open="clubDetailModalVisible"
      :bodyStyle="{ width: 800, height: 460 }"
    >
      <Loading
        :loading="loadingClubDetail"
        initialHeight="460ppx"
        backgroundColor="white"
      />
      <div class="club_detail_content">
        <div class="left">
          <div class="club_data">
            <div class="member_count">
              <PoweroffOutlined style="font-size: 30px" />
              <div>
                <span>members</span>
                <span>{{ memberList.length }}</span>
              </div>
            </div>
            <div class="activity_count">
              <PoweroffOutlined style="font-size: 30px" />
              <div>
                <span>activities</span>
                <span>{{ activityList.length }}</span>
              </div>
            </div>
          </div>
          <div class="member_area">
            <span class="title">current member</span>
            <a-empty
              description="No members join yet"
              v-if="!memberList.length"
            ></a-empty>
            <div class="member_list">
              <div class="item" v-for="member in memberList" :key="member.id">
                <div class="left">
                  <img :src="member.avatar" alt="" />
                  <div class="student_info">
                    <span class="name">{{ member.name }}</span>
                    <span class="grade_college">{{
                      `${member.grade} · ${member.college}`
                    }}</span>
                  </div>
                </div>
                <!-- <span class="right"> {{ member.joinDays }}天前加入 </span> -->
              </div>
            </div>
          </div>
        </div>
        <div class="club_activity">
          <ActivityCard
            v-for="activity in activityList"
            :key="activity.title"
            v-bind="activity"
          />
          <a-empty
            description="No events yet"
            v-if="!activityList.length"
          ></a-empty>
        </div>
      </div>
      <div
        class="club_detail_operation_area"
        v-if="isLogin && type === 'student'"
      >
        <a-button
          @click="sendMessageModalOpen = true"
          v-if="!hasJoined"
          type="primary"
          size="large"
        >
          <template #icon> <SmileTwoTone /> </template>
          apply to join the club
        </a-button>
        <p v-else class="has_join_tip">
          <CheckCircleTwoTone style="font-size: 20px" twoToneColor="#52c41a" />
          <span>you have joined the club</span>
        </p>
      </div>
    </a-modal>
  </div>
</template>

<style lang="less" scoped>
.club_square_container {
  min-height: calc(100vh - 180px);
  position: relative;
  .club_list {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-gap: 20px 30px;
  }
}
</style>

<style lang="less">
.club_detail_content {
  width: 800px;
  height: 400px;
  display: flex;
  position: relative;
  .left {
    width: 340px;
    flex: 0 0 auto;
    .club_data {
      width: 340px;
      height: 100px;
      display: flex;
      justify-content: space-between;
      .member_count,
      .activity_count {
        color: white;
        width: 160px;
        height: 100%;
        box-sizing: border-box;
        padding: 0px 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 8px;
        div {
          display: flex;
          flex-direction: column;
          justify-items: center;
          align-items: flex-end;
          & span:nth-child(1) {
            margin-bottom: 8px;
            display: block;
          }
          span {
            font-size: 16px;
          }
        }
      }
      .member_count {
        background-color: rgb(57, 206, 199);
      }
      .activity_count {
        background-color: rgb(217, 108, 212);
      }
    }
    .member_area {
      height: 300px;
      box-sizing: border-box;
      padding-top: 15px;
      .title {
        line-height: 30px;
        font-weight: bold;
        font-size: 16px;
        color: #000;
      }
      .member_list {
        height: 255px;
        overflow: auto;
        .item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 70px;
          .left {
            width: auto;
            display: flex;
            img {
              width: 50px;
              height: 50px;
              border-radius: 8px;
              object-fit: cover;
              margin-right: 10px;
            }
            .student_info {
              display: flex;
              flex-direction: column;
              justify-content: center;
              .name {
                color: rgb(51, 51, 51);
                font-size: 14px;
                margin-bottom: 5px;
                display: block;
              }
              .grade_college {
                color: rgb(153, 153, 153);
                font-size: 11px;
              }
            }
          }
          .right {
            display: block;
            width: 100px;
          }
        }
      }
    }
  }
  .club_activity {
    flex: 1 1 auto;
    height: 400px;
    overflow: auto;
    box-sizing: border-box;
    padding: 10px;
    padding-top: 0px;
  }
}
.club_detail_operation_area {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  .has_join_tip {
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      display: block;
      margin-left: 8px;
    }
  }
}
.empty_club_list {
  width: 100%;
  height: calc(100vh - 180px);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
