<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import { PlusSquareOutlined } from '@ant-design/icons-vue'
import { Button } from 'ant-design-vue'
import { RuleObject } from 'ant-design-vue/es/form/interface'
import { FormExpose } from 'ant-design-vue/es/form/Form'
import { useRouter } from 'vue-router'

export interface LoginFormState {
  account: string
  password: string
}

export default defineComponent({
  setup() {
    const router = useRouter()
    const formRef = ref<FormExpose>({} as any)
    const formState = reactive<LoginFormState>({
      account: '',
      password: ''
    })
    const rules: Record<string, RuleObject | RuleObject[]> = {
      account: [
        { required: true, message: '请输入账号', trigger: 'blur' },
        {
          min: 8,
          max: 16,
          message: '账号长度为8~16位',
          trigger: 'blur'
        }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        {
          min: 8,
          max: 16,
          message: '密码长度为8~16位',
          trigger: 'blur'
        }
      ]
    }

    const submit = () => {
      formRef.value
        .validateFields()
        .then((state) => {
          const { account, password } = state as LoginFormState
          console.log('account', account)
          console.log('password', password)
        })
        .catch((err) => console.log('err', err))
    }

    const navigateToRegister = () => router.push('/register')

    return {
      formRef,
      formState,
      rules,
      submit,
      labelCol: { span: 4 },
      wrapperCol: { span: 18, offset: 2 },
      navigateToRegister
    }
  },
  components: {
    PlusSquareOutlined,
    Button
  }
})
</script>
<template>
  <div class="login_container">
    <div class="wrapper">
      <div class="welcome_area">
        <div class="top_logo">
          <PlusSquareOutlined />
          <span class="title">学生俱乐部系统</span>
        </div>
        <div class="detail">
          <span class="welcome">欢迎回来</span>
          <span class="description">这里是学生俱乐部平台</span>
          <span class="description">来加入更多有趣的俱乐部吧！</span>
          <Button @click="navigateToRegister">没账号，去注册</Button>
        </div>
      </div>
      <div class="login_area">
        <span class="login_text">登录俱乐部系统</span>
        <div class="form_area">
          <a-form ref="formRef" :model="formState" :rules="rules" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-form-item label="账号" name="account">
              <a-input v-model:value="formState.account" placeholder="请输入账号..." />
            </a-form-item>
            <a-form-item label="密码" name="password">
              <a-input type="password" v-model:value="formState.password" placeholder="请输入密码" />
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="submit">现在登录</a-button>
            </a-form-item>
          </a-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='less' scoped>
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
