import type { LoginPayload, ResponseFormatter, Club, UserInfo } from './interface'
import axios from 'axios'
import { needTipRequest } from './const'
import { message } from 'ant-design-vue'

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 3000
})



axiosInstance.interceptors.response.use((res) => {
    const requestUrl = res.request.responseURL as string
    const successInfo = res.data.message
    if (needTipRequest.find(target => requestUrl.includes(target))) {
        message.success(successInfo, 2)
    }
    return res
}, err => {
    console.log('请求失败', err)
})

export * from './interface'
export * from './message'
export * from './manager'
export * from './admin'
export * from './student'

export function login(payload: LoginPayload) {
    return axiosInstance.post<ResponseFormatter<UserInfo>>('/user/login', {
        ...payload
    })
}

export function getAllClubPreviewInfo() {
    return axiosInstance.get<ResponseFormatter<Club[]>>('/club/allPreviewInfo')
}

export function judgeIsJoinClub(userId: number, clubId: number) {
    return axiosInstance.post<ResponseFormatter<boolean>>('/club/judgeIsJoin', {
        userId,
        clubId
    })
}




