import type { LoginPayload, ResponseFormatter, UserInfo, SendMessagePayload, MessageResType, ClubPreviewType } from './interface'
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
    const errorMessage = err.response.data.message
    message.error(errorMessage, 2)
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
    return axiosInstance.get<ResponseFormatter<ClubPreviewType[]>>('/club/allPreviewInfo')
}

export function judgeIsJoinClub(userId: number, clubId: number) {
    return axiosInstance.post<ResponseFormatter<boolean>>('/club/judgeIsJoin', {
        userId,
        clubId
    })
}

export function sendMessage(data: SendMessagePayload) {
    return axiosInstance.post('/message/send', data)
}

export function getAllMessage(userId: number) {
    return axiosInstance.get<ResponseFormatter<MessageResType[]>>(`/message/getAll?userId=${userId}`)
}

export function updateLastReadTime(userId: number) {
    return axiosInstance.get(`/user/updateReadMessageTime?userId=${userId}`)
}



