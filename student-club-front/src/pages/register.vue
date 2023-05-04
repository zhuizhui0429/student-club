<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { RuleObject } from "ant-design-vue/es/form/interface";
import { FormExpose } from "ant-design-vue/es/form/Form";
import { register, RegisterPayload } from "@api";
import { useRouter } from "vue-router";
import { pause } from "@api";

interface RegisterFormState extends RegisterPayload {
  password2: string;
}
const passwordReg = /^([a-zA-Z]+[0-9]+)|([0-9]+[a-zA-Z]+)$/;

export default defineComponent({
  setup() {
    const formRef = ref<FormExpose>({} as any);
    const formState = reactive<RegisterFormState>({} as any);

    const validatePassword = async function (
      _rule: RuleObject,
      value: RegisterFormState["password"]
    ) {
      if (value.length < 8 || value.length > 16) {
        return Promise.reject(
          "The length of the password needs to be between 8 and 16 characters"
        );
      } else if (!passwordReg.test(value)) {
        return Promise.reject("Password must contain both numbers and letters");
      }
      return Promise.resolve();
    };

    const validatePassword2 = async function (
      _rule: RuleObject,
      value: RegisterFormState["password2"]
    ) {
      if (value.length === 0) {
        return Promise.reject(
          "Please enter the password again for secondary confirmation"
        );
      } else if (value !== formState.password) {
        return Promise.reject(
          "The two passwords entered before and after are inconsistent"
        );
      }
      return Promise.resolve();
    };

    const rules: Record<keyof RegisterFormState, RuleObject | RuleObject[]> = {
      type: [
        {
          required: true,
          message: "Please choose your identity to register",
          trigger: "blur",
        },
      ],
      account: [
        {
          min: 8,
          max: 16,
          message: "Account length is 8~16 digits",
          trigger: "change",
        },
        {
          required: true,
          message: "Please fill in your account",
          trigger: "blur",
        },
      ],
      password: [
        { required: true, validator: validatePassword, trigger: "change" },
      ],
      password2: [
        { required: true, validator: validatePassword2, trigger: "change" },
      ],
    };

    const router = useRouter();
    const isRegistering = ref<boolean>(false);
    const handleRegister = () => {
      formRef.value.validateFields().then(
        async (res) => {
          isRegistering.value = true;
          const { account, password, type } = res as RegisterFormState;
          await register({
            account,
            password,
            type,
          });
          router.push("/login");
        },
        (err) => {
          console.log("err", err);
        }
      );
    };

    const reset = () => formRef.value.resetFields();

    return {
      formRef,
      formState,
      rules,
      handleRegister,
      reset,
      isRegistering,
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
  },
});
</script>

<template>
  <div class="register_container">
    <div class="content">
      <span class="title">welcome to register</span>
      <div class="form_area">
        <a-form
          ref="formRef"
          :rules="rules"
          :model="formState"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-item has-feedback label="account" name="account">
            <a-input
              v-model:value="formState.account"
              placeholder="Please fill in the account number"
            />
          </a-form-item>
          <a-form-item has-feedback label="password" name="password">
            <a-input-password
              v-model:value="formState.password"
              placeholder="Please fill in the password"
            />
          </a-form-item>
          <a-form-item
            has-feedback
            label="Second confirmation"
            name="password2"
          >
            <a-input-password
              v-model:value="formState.password2"
              placeholder="please re-enter the password"
            />
          </a-form-item>
          <a-form-item label="user type" name="type">
            <a-select
              v-model:value="formState.type"
              placeholder="Please choose your registration status"
            >
              <a-select-option value="student">student</a-select-option>
              <a-select-option value="manager">club manager</a-select-option>
            </a-select>
          </a-form-item>
          <div class="operation_area">
            <a-button
              size="large"
              type="primary"
              @click="handleRegister"
              :loading="isRegistering"
              >register</a-button
            >
            <a-button
              size="large"
              style="margin-left: 20px"
              type="dashed"
              @click="reset"
              >reset</a-button
            >
          </div>
        </a-form>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.register_container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #b8c4d1;
  .content {
    width: 700px;
    height: 600px;
    background-color: white;
    border-radius: 15px;
    box-sizing: border-box;
    padding: 10px 20px;
    .title {
      line-height: 60px;
      font-size: 24px;
      display: block;
      margin-bottom: 30px;
      color: #2bc17b;
      text-align: center;
    }
    .ant-form-item {
      height: 40px;
    }
    .operation_area {
      padding-top: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
