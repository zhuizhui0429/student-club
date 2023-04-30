import type { LoginPayload, ResponseFormatter, Club, UserInfo } from './interface'
import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 3000
})

export * from './interface'
export * from './message'
export * from './manager'
export * from './admin'

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




