import { ClubPreviewType } from '@comp/clubCard'
import { entryConditions } from '@const'

export * from './message'
export * from './manager'

export function pause(time: number) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(true), time)
    })
}

export function getRandomNum(min: number, max: number) {
    return min + Math.floor(Math.random() * (max - min))
}

export interface ClubPreviewType {
    poster: string
    clubName: string
    clubId: number
    description: string
}

export async function getClubList(): Promise<ClubPreviewType[]> {
    await pause(getRandomNum(500, 700))
    const list: ClubPreviewType[] = [
        {
            poster: 'https://img2.baidu.com/it/u=170237391,555920326&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1682528400&t=337d85de8148e64f3b0d473fb2421539',
            clubName: '足球俱乐部',
            clubId: 1,
            description: '足球俱乐部快来红红火火恍恍惚惚'
        },
        {
            poster: 'https://ns-strategy.cdn.bcebos.com/ns-strategy/upload/fc_big_pic/part-00282-2863.jpg',
            clubName: '健身俱乐部',
            clubId: 1,
            description: '健身俱乐部快来红红火火恍恍惚惚'
        }
    ]
    return list.reduce((prev, cur) => {
        const count = getRandomNum(3, 8)
        const append = []
        for (let i = 0; i < count; i++) {
            append.push(cur)
        }
        return prev.concat(append)
    }, [] as ClubPreviewType[])
}

export interface MemberOfClub {
    name: string
    grade: string
    college: string
    joinDays: number
    avatar: string,
    id: number
}
export async function getClubMembers(): Promise<MemberOfClub[]> {
    await pause(getRandomNum(100, 300))
    const members: MemberOfClub[] = [
        {
            id: Math.random(),
            name: '周志祥',
            grade: '大四',
            college: '计网院',
            joinDays: 555,
            avatar: 'https://img1.baidu.com/it/u=1889141371,3742825600&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1682614800&t=4d460afc745b0cc14a642f5c15176b34'
        },
        {
            id: Math.random(),
            name: '剑豪',
            grade: '大一',
            college: '艾欧尼亚',
            joinDays: 1999,
            avatar: 'https://img2.baidu.com/it/u=800202346,1670856653&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1682614800&t=9b2040ec5ef17d98b7d5a718583b39bf'
        }
    ]
    return members.reduce((prev, cur) => prev.concat(new Array(getRandomNum(2, 6)).fill(0).map(() => cur)), [] as MemberOfClub[])
}

export interface ActivityOfClub {
    poster: string
    title: string
    date: string
    location: string
    entryCondition: (typeof entryConditions)[number]
}

export async function getClubActivityOfClubs(): Promise<ActivityOfClub[]> {
    await pause(getRandomNum(200, 600))
    const activities: ActivityOfClub[] = [
        {
            title: '第一届足球校园赛',
            poster: 'https://img0.baidu.com/it/u=4238916334,388690259&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=666',
            date: '2023-04-29',
            location: '广东宏远',
            entryCondition: '免费'
        },
        {
            title: '趣味足球培训',
            poster: 'https://img0.baidu.com/it/u=1991714241,3943361395&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=705',
            date: '2022-05-29',
            location: '南苑球场',
            entryCondition: '免费'
        }
    ]
    return activities.reduce((prev, cur) => prev.concat(new Array(getRandomNum(3, 10)).fill(0).map(() => cur)), [] as ActivityOfClub[])
}

export async function hasJoinClub(clubId: number, userId: number): Promise<boolean> {
    return Math.random() > 0.5 ? true : false
}



export interface UserHasJoinedClubPreviewType extends Omit<ClubPreviewType, 'description'> {
    memberCount: number
}
export async function getUserHasJoinedClubList(userId: number): Promise<UserHasJoinedClubPreviewType[]> {
    await pause(getRandomNum(500, 800))
    const joinedClubList: UserHasJoinedClubPreviewType[] = [
        {
            memberCount: 884,
            poster: 'https://img0.baidu.com/it/u=1991714241,3943361395&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=705',
            clubName: '健身俱乐部',
            clubId: 1
        },
        {
            memberCount: 777,
            poster: 'https://img2.baidu.com/it/u=1421298323,1002032691&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500',
            clubName: '篮球俱乐部',
            clubId: 1
        }
    ]
    return joinedClubList.reduce((prev, cur) => prev.concat(new Array(getRandomNum(3, 10)).fill(0).map(() => cur)), [] as UserHasJoinedClubPreviewType[])
}



