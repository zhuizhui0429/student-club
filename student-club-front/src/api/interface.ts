import { entryConditions } from '@const'
import type { role } from '../router'

export type ResponseFormatter<T> = {
    message: string
    success: boolean
    data: T
    timestamp: string
}

export interface Club {
    id: number
    clubName: string
    description: string
    poster: string
}

export interface ClubPreviewType extends Club {
    managerId: number
}

export interface CreateClubPayload extends Pick<Club, 'clubName' | 'description'> {
    managerId: number
    poster: File
}

export interface ActivityOfClub {
    id: number
    poster: string
    title: string
    date: string
    location: string
    entryCondition: (typeof entryConditions)[number]
    description: string
}

export interface ActivityTableRecordType extends Omit<ActivityOfClub, 'title' | 'poster'> {
    titlePoster: {
        title: string
        poster: string
    }
}

export interface CreateActivityPayload
    extends Omit<ActivityOfClub, "date" | "poster" | "id"> {
    poster: File;
}

export interface UpdateActivityFormState extends Omit<ActivityOfClub, 'poster' | "date"> {
    poster: string | File
}

export interface MemberOfClub {
    name: string
    grade: string
    college: string
    joinDays: number
    avatar: string,
    id: number
}

export interface UserInfo {
    id: number
    name: string
    type: role
    avatar: string
    college: string
    description?: string
    grade: string,
    account: string
    password: string
    email?: string
}

export interface LoginPayload {
    account: string
    password: string
}

export interface RegisterPayload extends LoginPayload {
    type: role
}

export interface UpdateUserInfoPayload extends Pick<UserInfo, 'college' | 'description' | 'grade' | 'name' | 'id' | 'email'> {
    avatar: File | string
}

export type GetAllManagersResType = Array<{
    id: number
    name: string
    managerClubName?: string
}>

export type MessageType = 'joinClubApplication' | 'exitClubTip' | 'joinClubApproval' | 'joinClubRefuse' | 'private'
export type HandleStatus = 'approved' | 'refused' | 'pending' | 'none'
export interface Message {
    id?: number
    senderAvatar: string
    senderName: string
    senderId: number
    title: string
    content: string
    type: MessageType
}

export interface MessageResType extends Message {
    createTime: string
    hasRead: boolean
}

export interface SendMessagePayload extends Message {
    targetId: number
}

export interface ApproveJoinClubMessagePayload {
    applicantId: number
    managerId: number
    applicantMessageId: number
}

export interface RefuseJoinClubMessagePayload extends ApproveJoinClubMessagePayload {
    reason: string
}