<script lang="ts">
import { defineComponent, ref, reactive } from "vue";
import { PlusSquareOutlined } from "@ant-design/icons-vue";
import { Button } from "ant-design-vue";
import { RuleObject } from "ant-design-vue/es/form/interface";
import { FormExpose } from "ant-design-vue/es/form/Form";
import { useRouter } from "vue-router";
import { LoginPayload as LoginFormState, login } from "@api";
import { useUserStore } from "@store";

export default defineComponent({
  setup() {
    const router = useRouter();
    const userStore = useUserStore();
    const formRef = ref<FormExpose>({} as any);
    const formState = reactive<LoginFormState>({
      account: "",
      password: "",
    });
    const rules: Record<string, RuleObject | RuleObject[]> = {
      account: [
        { required: true, message: "please enter account", trigger: "blur" },
        {
          min: 8,
          max: 16,
          message: "Account length is 8~16 digits",
          trigger: "blur",
        },
      ],
      password: [
        { required: true, message: "please enter password", trigger: "blur" },
        {
          min: 8,
          max: 16,
          message: "Password length is 8~16 digits",
          trigger: "blur",
        },
      ],
    };

    const submit = () => {
      formRef.value
        .validateFields()
        .then((state) => {
          login(state as LoginFormState)
            .then((res) => {
              userStore.updateState({ ...res.data.data, isLogin: true });
              router.push({ name: "clubSquare" });
            })
            .catch((err) => {});
        })
        .catch((err) => console.log("err", err));
    };

    const navigateToRegister = () => router.push("/register");

    return {
      formRef,
      formState,
      rules,
      submit,
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
      navigateToRegister,
    };
  },
  components: {
    PlusSquareOutlined,
    Button,
  },
});
</script>
<template>
  <div class="login_container">
    <div class="wrapper">
      <div class="welcome_area">
        <div class="top_logo">
          <PlusSquareOutlined />
          <span class="title">Student Club System</span>
        </div>
        <div class="detail">
          <span class="welcome">Welcome back</span>
          <span class="description">This is the student club platform</span>
          <span class="description">Come and join more interesting clubs!</span>
          <Button @click="navigateToRegister"
            >No account, go to register</Button
          >
        </div>
      </div>
      <div class="login_area">
        <span class="login_text">Log in to the club system</span>
        <div class="form_area">
          <a-form
            ref="formRef"
            :model="formState"
            :rules="rules"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-form-item label="account" name="account">
              <a-input
                v-model:value="formState.account"
                placeholder="please enter account..."
              />
            </a-form-item>
            <a-form-item label="password" name="password">
              <a-input
                type="password"
                v-model:value="formState.password"
                placeholder="please enter password"
              />
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="submit">login now</a-button>
            </a-form-item>
          </a-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.login_container {
  width: 100vw;
  background-color: #b8c4d1;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  .wrapper {
    height: 400px;
    border-radius: 15px;
    display: flex;
    width: 800px;
    background-color: #fff;
  }
  .welcome_area {
    width: 300px;
    color: white;
    border-radius: 15px;
    border-bottom-right-radius: 0px;
    border-top-right-radius: 0px;
    background-color: rgba(50, 186, 136);
    .top_logo {
      height: 80px;
      display: flex;
      box-sizing: border-box;
      padding-left: 20px;
      align-items: center;
      .title {
        margin-left: 8px;
        font-size: 20px;
      }
    }
    .detail {
      height: 320px;
      box-sizing: border-box;
      padding-bottom: 80px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .welcome {
        font-size: 30px;
        margin-bottom: 16px;
      }
      .description {
        font-size: 12px;
        margin-bottom: 8px;
      }
      button {
        margin-top: 20px;
      }
    }
  }
  .login_area {
    width: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .login_text {
      margin-bottom: 30px;
      color: #2bc17b;
      font-size: 24px;
    }
    .form_area {
      height: 120px;
    }
    .ant-form-item {
      display: flex;
      justify-content: center;
      height: 36px;
      button {
        background-color: #2bc17b;
      }
    }
  }
}
</style>
