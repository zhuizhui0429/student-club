<script lang="ts">
import { defineComponent, ref, reactive } from "vue";
import { RuleObject } from "ant-design-vue/es/form/interface";
import { FormExpose } from "ant-design-vue/es/form/Form";
import { colleges, grades } from "@const";
import AvatarUpload from "@comp/avatarUpload.vue";
import { updateInfo } from "@api";
import { useUserStore } from "@store";
import { storeToRefs } from "pinia";

interface UserInfoFormState {
  nickname: string;
  college: string;
  avatar: File;
  grade: string;
  personalProfile: string;
  email: string;
}

export default defineComponent({
  props: {
    initialAvatar: {
      type: String,
      default: "",
    },
    nickname: {
      type: String,
      default: "",
    },
    college: {
      type: String,
      default: "",
    },
    grade: {
      type: String,
      default: "",
    },
    personalProfile: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const userStore = useUserStore();
    const { id } = storeToRefs(userStore);
    const { nickname, college, grade, personalProfile, initialAvatar, email } =
      props;
    const formRef = ref<FormExpose>({} as any);
    const formState = reactive<UserInfoFormState>({
      nickname,
      college: college,
      grade: grade,
      personalProfile,
      avatar: undefined as any,
      email,
    });

    const emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    const validateEmail = async function (
      _rule: RuleObject,
      value: UserInfoFormState["email"]
    ) {
      if (!value || emailReg.test(value)) {
        return Promise.resolve();
      }
      return Promise.reject();
    };
    const rules: Partial<Record<keyof UserInfoFormState, RuleObject[]>> = {
      avatar: [
        ...[
          ...(initialAvatar
            ? []
            : ([
                {
                  required: true,
                  message: "你还未选择过自己的头像,请上传头像",
                },
              ] as RuleObject[])),
        ],
      ],
      nickname: [
        {
          min: 2,
          max: 10,
          message: "昵称的长度需要在2~10之间",
          trigger: "blur",
        },
        {
          required: true,
          message: "你还未填写过自己的昵称,请填写",
        },
      ],
      college: [
        {
          required: true,
          message: "你还未选择过自己的学院信息,请选择学院",
        },
      ],
      grade: [
        {
          required: true,
          message: "你还未选择过自己的年级信息,请选择年级",
        },
      ],
      email: [
        {
          validator: validateEmail,
          trigger: "change",
          message: "邮箱格式不正确",
        },
      ],
      personalProfile: [
        {
          min: 5,
          max: 200,
          message: "个人简介的长度需要在5~200之间",
          trigger: "blur",
        },
      ],
    };

    const handleUpdateInfo = () => {
      formRef.value
        .validateFields()
        .then((res) => {
          const {
            avatar,
            nickname: name,
            grade,
            college,
            personalProfile: description,
            email,
          } = res as UserInfoFormState;
          updateInfo({
            avatar,
            name,
            grade,
            college,
            description,
            id: id.value,
            email,
          }).then((res) => {
            userStore.updateState({
              avatar: res.data.data.avatar,
              name,
              grade,
              college,
              description,
              email,
            });
          });
        })
        .catch((err) => {
          console.log("err", err);
        });
    };

    return {
      formRef,
      formState,
      rules,
      colleges,
      grades,
      labelCol: { span: 4 },
      wrapperCol: { span: 18, offset: 2 },
      handleUpdateInfo,
    };
  },
  components: {
    AvatarUpload,
  },
});
</script>

<template>
  <div class="edit_user_info_container">
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
    >
      <a-form-item label="头像" name="avatar">
        <AvatarUpload
          v-model:avatarFile="formState.avatar"
          :initialAvatar="initialAvatar"
        />
      </a-form-item>
      <a-form-item label="昵称" name="nickname">
        <a-input
          v-model:value="formState.nickname"
          placeholder="请输入新的昵称"
        />
      </a-form-item>
      <a-form-item label="学院" name="college">
        <a-select
          v-model:value="formState.college"
          placeholder="请选择你的学院"
        >
          <a-select-option
            v-for="college in colleges"
            :key="college"
            :value="college"
            >{{ college }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item label="年级" name="grade">
        <a-select v-model:value="formState.grade" placeholder="请选择你的年级">
          <a-select-option
            v-for="grade in grades"
            :key="grade"
            :value="grade"
            >{{ grade }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item label="邮箱" name="email">
        <a-input
          v-model:value="formState.email"
          placeholder="可绑定邮箱接受俱乐部邮件通知"
        />
      </a-form-item>
      <a-form-item label="个人简介" name="personalProfile">
        <a-textarea
          :rows="2"
          style="resize: none"
          v-model:value="formState.personalProfile"
        />
      </a-form-item>
      <a-form-item :wrapperCol="{ offset: 8, span: 8 }">
        <a-button type="primary" size="large" @click="handleUpdateInfo"
          >更新信息</a-button
        >
      </a-form-item>
    </a-form>
  </div>
</template>

<style lang="less" scoped>
.edit_user_info_container {
  width: 400px;
  height: 500px;
}
</style>
