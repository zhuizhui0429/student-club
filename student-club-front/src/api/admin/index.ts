import { axiosInstance, CreateClubPayload, GetAllManagersResType, ResponseFormatter } from '@api';

export function createClub(data: CreateClubPayload) {
    const { poster, ...rest } = data
    const formData = new FormData()
    formData.append('image', poster)
    Object.keys(rest).forEach((key) => formData.append(key, String(rest[key as keyof typeof rest])))
    return axiosInstance.post('/club/create', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export function getAllManagers() {
    return axiosInstance.get<ResponseFormatter<GetAllManagersResType>>('/user/allManagers')
}