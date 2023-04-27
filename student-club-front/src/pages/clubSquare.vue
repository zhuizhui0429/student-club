<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import ClubCard from "@/components/clubCard.vue";
import ActivityCard from "@/components/activityCard.vue";
import Loading from "@/components/loading.vue";
import {
  getClubList,
  ClubPreviewType,
  getClubMembers,
  MemberOfClub,
  getClubActivityOfClubs,
  ActivityOfClub,
  hasJoinClub,
} from "@api";
import {
  PoweroffOutlined,
  CheckCircleTwoTone,
  SmileTwoTone,
} from "@ant-design/icons-vue";

export default defineComponent({
  setup() {
    const clubList = ref<ClubPreviewType[]>([]);
    const memberList = ref<MemberOfClub[]>([]);
    const activityList = ref<ActivityOfClub[]>([]);
    const clubDetailModalVisible = ref<boolean>(false);
    const hasJoined = ref<boolean>(false);
    const loadingClubList = ref<boolean>(true);
    const loadingClubDetail = ref<boolean>(true);

    onMounted(() => {
      getClubList().then((res) => {
        clubList.value = res;
        loadingClubList.value = false;
      });
    });

    const handleClickClubCard = async (id: number) => {
      clubDetailModalVisible.value = true;
      loadingClubDetail.value = true;
      const [members, activities, joinJudge] = await Promise.all([
        getClubMembers(),
        getClubActivityOfClubs(),
        hasJoinClub(id, 1),
      ]);
      memberList.value = members;
      activityList.value = activities;
      hasJoined.value = joinJudge;
      loadingClubDetail.value = false;
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
    };
  },
  components: {
    PoweroffOutlined,
    CheckCircleTwoTone,
    SmileTwoTone,
    ClubCard,
    ActivityCard,
    Loading,
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
    <Loading
      size="large"
      :loading="loadingClubList"
      initialHeight="calc(100vh - 180px)"
    />
    <a-modal
      title="足球俱乐部"
      :width="848"
      :footer="null"
      v-model:open="clubDetailModalVisible"
      bodyStyle="width:800px;height:460px;"
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
                <span>成员数</span>
                <span>999</span>
              </div>
            </div>
            <div class="activity_count">
              <PoweroffOutlined style="font-size: 30px" />
              <div>
                <span>活动数</span>
                <span>999</span>
              </div>
            </div>
          </div>
          <div class="member_area">
            <span class="title">当前成员</span>
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
                <span class="right"> {{ member.joinDays }}天前加入 </span>
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
        </div>
      </div>
      <div class="club_detail_operation_area">
        <a-button v-if="!hasJoined" type="primary" :size="size">
          <template #icon> <SmileTwoTone /> </template>
          申请加入俱乐部
        </a-button>
        <p v-else class="has_join_tip">
          <CheckCircleTwoTone style="font-size: 20px" twoToneColor="#52c41a" />
          <span>你已加入该俱乐部</span>
        </p>
      </div>
      >
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
</style>
