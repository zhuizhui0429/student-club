<script lang="ts">
import { defineComponent, ref, toRefs } from "vue";
import { UploadOutlined } from "@ant-design/icons-vue";
import { defaultAvatar } from "@/constant";

function getBase64(img: Blob) {
  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result as string));
    reader.readAsDataURL(img);
  });
}
export default defineComponent({
  props: {
    initialAvatar: {
      type: String,
      default: "",
    },
  },
  emits: ["update:avatarFile"],
  setup(props, { emit }) {
    const { initialAvatar } = toRefs(props);
    const selectedAvatar = ref<string>(initialAvatar.value);

    const beforeUpload = async (file: File) => {
      const temptUrl = await getBase64(file);
      selectedAvatar.value = temptUrl;
      emit("update:avatarFile", file);
      return false;
    };

    return {
      selectedAvatar,
      beforeUpload,
      defaultAvatar,
    };
  },
  components: {
    UploadOutlined,
  },
});
</script>

<template>
  <div class="avatar_upload_container">
    <a-upload :showUploadList="false" :before-upload="beforeUpload">
      <a-button>
        <upload-outlined></upload-outlined>
        Click to upload avatar
      </a-button>
    </a-upload>
    <a-image
      class="avatar"
      :width="100"
      :height="100"
      :src="selectedAvatar"
      :fallback="defaultAvatar"
      alt=""
    />
  </div>
</template>

<style lang="less">
.avatar_upload_container {
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .ant-image {
    margin-left: 20px;
    .ant-image-img {
      width: 100px;
      height: 100px;
      object-fit: cover;
      border-radius: 10px;
    }
  }
}
</style>
