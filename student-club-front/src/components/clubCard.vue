<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    poster: {
      type: String,
      required: true,
    },
    clubName: {
      type: String,
      required: true,
    },
    id: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      default: "这是一段关于俱乐部的简短描述",
    },
    managerId: {
      type: Number,
    },
  },
  emit: ["viewClubDetail"],
  setup() {},
});
</script>

<template>
  <div
    class="club_card_container"
    @click="$emit('viewClubDetail', id, managerId)"
  >
    <img class="poster" :src="poster" alt="" />
    <span class="club_name">{{ clubName }}</span>
    <span class="desc">{{ description }}</span>
  </div>
</template>
<style lang="less" scoped>
.club_card_container {
  width: 240px;
  height: 200px;
  padding: 15px;
  border-radius: 15px;
  background-color: white;
  transition: all 0.5s;
  &:hover {
    transform: translateY(-10px);
    box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
      rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
  }
  cursor: pointer;
  img {
    width: 100%;
    height: 120px;
    object-fit: cover;
  }
  .club_name {
    font-size: 18px;
    display: block;
  }
  .desc {
    font-size: 14px;
  }
}
</style>
