import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'
import type { UserInfo } from '@api'

const LOGIN_INFO = 'login_info'

interface UserStoreStateType extends Omit<UserInfo, 'account' | 'password'> {
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
        isLogin: Boolean(localStorage.getItem(LOGIN_INFO))
    }
    const storageState = JSON.parse(localStorage.getItem(LOGIN_INFO) || JSON.stringify(defaultState))
    const userState = reactive<UserStoreStateType>(storageState)

    function login(info: UserInfo) {
        const { name, type, avatar, id, college, grade, description } = info
        userState.name = name
        userState.type = type
        userState.avatar = avatar
        userState.isLogin = true
        userState.id = id
        userState.college = college
        userState.grade = grade
        userState.description = description
        localStorage.setItem(LOGIN_INFO, JSON.stringify({ name, type, avatar, id, college, grade, description }))
    }

    function exitLogin() {
        localStorage.removeItem(LOGIN_INFO)
        userState.isLogin = false
    }

    return { ...toRefs(userState), login, exitLogin }
})