import type {
    MemberOfClub, CreateActivityPayload, ActivityOfClub, ResponseFormatter, UpdateActivityFormState
} from "@api";
import { axiosInstance } from '@api';

export function createActivity(data: CreateActivityPayload, clubId: number) {
    const { poster, ...rest } = data
    const formData = new FormData()
    formData.append('image', poster)
    formData.append('clubId', String(clubId))
    Object.keys(rest).forEach((key) => formData.append(key, String(rest[key as keyof typeof rest])))
    return axiosInstance.post('/activity/create', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export function getAllActivitiesOfClub(clubId: number) {
    return axiosInstance.get<ResponseFormatter<ActivityOfClub[]>>(`/club/allActivities?clubId=${clubId}`)
}

export function getAllMembersOfClub(clubId: number) {
    return axiosInstance.get<ResponseFormatter<MemberOfClub[]>>(`/club/members?clubId=${clubId}`)
}

export function updateActivity(data: UpdateActivityFormState) {
    const { poster, ...rest } = data
    const formData = new FormData()
    if (typeof poster !== 'string') {
        formData.append('image', poster)
    }
    else {
        formData.append('originalPoster', poster)
    }
    Object.keys(rest).forEach((key) => formData.append(key, String(rest[key as keyof typeof rest])))
    return axiosInstance.post('/activity/update', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}
