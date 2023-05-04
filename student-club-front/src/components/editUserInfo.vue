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
                  message: "Please upload an avatar",
                },
              ] as RuleObject[])),
        ],
      ],
      nickname: [
        {
          min: 2,
          max: 10,
          message: "The length of the nickname needs to be between 2 and 10",
          trigger: "blur",
        },
        {
          required: true,
          message: "Please fill in nickname",
        },
      ],
      college: [
        {
          required: true,
          message: "Please select a college",
        },
      ],
      grade: [
        {
          required: true,
          message: "Please select grade",
        },
      ],
      email: [
        {
          validator: validateEmail,
          trigger: "change",
          message: "E-mail format is incorrect",
        },
      ],
      personalProfile: [
        {
          min: 5,
          max: 200,
          message: "The length of the profile needs to be between 5 and 200",
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
      <a-form-item label="avatar" name="avatar">
        <AvatarUpload
          v-model:avatarFile="formState.avatar"
          :initialAvatar="initialAvatar"
        />
      </a-form-item>
      <a-form-item label="name" name="nickname">
        <a-input
          v-model:value="formState.nickname"
          placeholder="Please enter a new nickname"
        />
      </a-form-item>
      <a-form-item label="college" name="college">
        <a-select
          v-model:value="formState.college"
          placeholder="Please select a college"
        >
          <a-select-option
            v-for="college in colleges"
            :key="college"
            :value="college"
            >{{ college }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item label="grade" name="grade">
        <a-select
          v-model:value="formState.grade"
          placeholder="Please select a grade"
        >
          <a-select-option
            v-for="grade in grades"
            :key="grade"
            :value="grade"
            >{{ grade }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item label="email" name="email">
        <a-input
          v-model:value="formState.email"
          placeholder="You can bind your mailbox to receive club email notifications"
        />
      </a-form-item>
      <a-form-item label="profile" name="personalProfile">
        <a-textarea
          :rows="2"
          style="resize: none"
          v-model:value="formState.personalProfile"
        />
      </a-form-item>
      <a-form-item :wrapperCol="{ offset: 8, span: 8 }">
        <a-button type="primary" size="large" @click="handleUpdateInfo"
          >Update information</a-button
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
