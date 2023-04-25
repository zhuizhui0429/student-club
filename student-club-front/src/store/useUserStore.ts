import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'

interface UserStoreStateType {
    name: string,
    account: string,
    type: 'student' | 'manager' | 'admin',
    avatar: string
}

export const useUserStore = defineStore('user', () => {
    const userState = reactive<UserStoreStateType>({
        name: '',
        account: '',
        type: 'student',
        avatar: ''
    })

    function setState(info: UserStoreStateType) {
        const { name, account, type, avatar } = info
        userState.name = name
        userState.account = account
        userState.type = type
        userState.avatar = avatar
    }

    return { ...toRefs(userState), setState }
})