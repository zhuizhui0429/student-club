import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'
import type { UserInfo } from '@api'
import { login as loginRequest } from '@api'

export const LOGIN_INFO = 'login_state'

interface UserStoreStateType extends UserInfo {
    isLogin: boolean
}

export const useUserStore = defineStore('user', () => {
    const defaultState = {
        name: '',
        type: 'student',
        avatar: '',
        id: 0,
        college: '',
        description: '',
        grade: '',
        isLogin: false
    }
    const storageState = JSON.parse(localStorage.getItem(LOGIN_INFO) || JSON.stringify(defaultState))
    const userState = reactive<UserStoreStateType>(storageState)

    function updateState(state: Partial<UserStoreStateType>) {
        Object.keys(state).forEach((key) => {
            (userState as Record<string, any>)[key] = state[key as keyof UserStoreStateType]
        })
        localStorage.setItem(LOGIN_INFO, JSON.stringify({ ...userState, ...state, isLogin: true }))
        userState.name = userState.name || '未命名用户'
    }

    function exitLogin() {
        localStorage.removeItem(LOGIN_INFO)
        userState.isLogin = false
    }

    function refreshData() {
        if (localStorage.getItem(LOGIN_INFO)) {
            const { password, account } = JSON.parse(localStorage.getItem(LOGIN_INFO)!)
            loginRequest({
                account,
                password
            }).then(res => {
                updateState(res.data.data)
            })
        }
    }

    return { ...toRefs(userState), updateState, exitLogin, refreshData }
})