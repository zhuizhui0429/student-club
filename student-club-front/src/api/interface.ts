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

export interface CreateActivityPayload
    extends Omit<ActivityOfClub, "date" | "poster"> {
    poster: File;
}

export interface UpdateActivityFormState extends Omit<CreateActivityPayload, 'poster'> {
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
    description: string
    grade: string,
    account: string
    password: string
}

export interface LoginPayload {
    account: string
    password: string
}