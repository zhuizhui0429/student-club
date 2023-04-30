import type { Club, ResponseFormatter, UpdateUserInfoPayload, UserInfo } from '@api'
import { axiosInstance } from '@api'

export function getAllJoinedClubs(userId: number) {
    return axiosInstance.get<ResponseFormatter<Club[]>>(`/user/joinedClubs?userId=${userId}`)
}

export function updateInfo(data: UpdateUserInfoPayload) {
    const { avatar, ...rest } = data
    const formData = new FormData()
    if (typeof avatar === 'string') {
        formData.append('originalAvatar', avatar)
    }
    else {
        formData.append('avatar', avatar)
    }
    Object.keys(rest).forEach((key) => formData.append(key, String(rest[key as keyof typeof rest])))
    return axiosInstance.post<ResponseFormatter<UserInfo>>('/user/updateInfo', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}