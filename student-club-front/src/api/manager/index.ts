import type {
    MemberOfClub, CreateActivityPayload, ActivityOfClub, ResponseFormatter, UpdateActivityFormState,
    ApproveJoinClubMessagePayload, RefuseJoinClubMessagePayload
} from "@api";
import { axiosInstance } from '@api';

export function createActivity(data: CreateActivityPayload, managerId: number) {
    const { poster, ...rest } = data
    const formData = new FormData()
    formData.append('image', poster)
    formData.append('managerId', String(managerId))
    Object.keys(rest).forEach((key) => formData.append(key, String(rest[key as keyof typeof rest])))
    return axiosInstance.post('/activity/create', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export function getAllActivitiesOfClub(managerId: number) {
    return axiosInstance.get<ResponseFormatter<ActivityOfClub[]>>(`/club/allActivities?managerId=${managerId}`)
}

export function getAllMembersOfClub(managerId: number) {
    return axiosInstance.get<ResponseFormatter<MemberOfClub[]>>(`/club/members?managerId=${managerId}`)
}

export function getAllActivitiesByClubId(clubId: number) {
    return axiosInstance.get<ResponseFormatter<ActivityOfClub[]>>(`/club/allActivitiesByClubId?clubId=${clubId}`)
}

export function getAllMembersByClubId(clubId: number) {
    return axiosInstance.get<ResponseFormatter<MemberOfClub[]>>(`/club/membersByClubId?clubId=${clubId}`)
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

export function approveJoin(payload: ApproveJoinClubMessagePayload) {
    return axiosInstance.post(`/club/approveJoin`, {
        ...payload
    })
}

export function refuseJoin(payload: RefuseJoinClubMessagePayload) {
    return axiosInstance.post('/club/refuseJoin', {
        ...payload
    })
}


