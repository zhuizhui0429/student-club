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
        return Promise.reject("密码的长度需要在8~16位之间");
      } else if (!passwordReg.test(value)) {
        return Promise.reject("密码必须同时包含数字和字母");
      }
      return Promise.resolve();
    };

    const validatePassword2 = async function (
      _rule: RuleObject,
      value: RegisterFormState["password2"]
    ) {
      if (value.length === 0) {
        return Promise.reject("请再次输入密码进行二次确认");
      } else if (value !== formState.password) {
        return Promise.reject("前后两次密码输入不一致");
      }
      return Promise.resolve();
    };

    const rules: Record<keyof RegisterFormState, RuleObject | RuleObject[]> = {
      type: [
        {
          required: true,
          message: "请选择你的身份再进行注册",
          trigger: "blur",
        },
      ],
      account: [
        {
          min: 8,
          max: 16,
          message: "账号长度为8~16位",
          trigger: "change",
        },
        {
          required: true,
          message: "请填写你的账号",
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
      wrapperCol: { span: 14 },
    };
  },
});
</script>

<template>
  <div class="register_container">
    <div class="content">
      <span class="title">欢迎注册</span>
      <div class="form_area">
        <a-form
          ref="formRef"
          :rules="rules"
          :model="formState"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-item has-feedback label="账号" name="account">
            <a-input
              v-model:value="formState.account"
              placeholder="请填写账号"
            />
          </a-form-item>
          <a-form-item has-feedback label="密码" name="password">
            <a-input-password
              v-model:value="formState.password"
              placeholder="请填写密码"
            />
          </a-form-item>
          <a-form-item has-feedback label="二次确认" name="password2">
            <a-input-password
              v-model:value="formState.password2"
              placeholder="请再次填写密码"
            />
          </a-form-item>
          <a-form-item label="用户类型" name="type">
            <a-select
              v-model:value="formState.type"
              placeholder="请选择你的注册身份"
            >
              <a-select-option value="student">学生</a-select-option>
              <a-select-option value="manager">俱乐部经理</a-select-option>
            </a-select>
          </a-form-item>
          <div class="operation_area">
            <a-button
              size="large"
              type="primary"
              @click="handleRegister"
              :loading="isRegistering"
              >注册</a-button
            >
            <a-button
              size="large"
              style="margin-left: 20px"
              type="dashed"
              @click="reset"
              >清空</a-button
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
    width: 480px;
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
