import type { MemberOfClub, ActivityOfClub } from "@api";
import { pause, getRandomNum } from '@api';

export interface ActivityFormStateType
    extends Omit<ActivityOfClub, "date" | "poster"> {
    poster: File | string;
    description: string;
}

export interface ClubMemberTableRecordType
    extends Pick<MemberOfClub, "grade" | "college" | "id" | "joinDays"> {
    member: {
        nickname: MemberOfClub["name"];
        avatar: MemberOfClub["avatar"];
    };
    key: string | number;
}
export async function getAllMemberListOfClub(clubId: number) {
    await pause(getRandomNum(300, 700))
    const memberList: ClubMemberTableRecordType[] = [
        {
            key: "1",
            member: {
                nickname: "周志祥",
                avatar:
                    "https://img2.baidu.com/it/u=3618236253,1028428296&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1682701200&t=38d35ae793fc0be2273e2b39cac75135",
            },
            grade: "大三",
            college: "计网院",
            id: 1,
            joinDays: 233,
        },
        {
            key: "2",
            member: {
                nickname: "zzx",
                avatar:
                    "https://img2.baidu.com/it/u=3618236253,1028428296&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1682701200&t=38d35ae793fc0be2273e2b39cac75135",
            },
            grade: "大三",
            college: "计网院",
            id: 1,
            joinDays: 233,
        },
        {
            key: "3",
            member: {
                nickname: "bibo123",
                avatar:
                    "https://img2.baidu.com/it/u=3618236253,1028428296&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1682701200&t=38d35ae793fc0be2273e2b39cac75135",
            },
            grade: "大三",
            college: "计网院",
            id: 1,
            joinDays: 233,
        },
        {
            key: "4",
            member: {
                nickname: "周志祥",
                avatar:
                    "https://img2.baidu.com/it/u=3618236253,1028428296&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1682701200&t=38d35ae793fc0be2273e2b39cac75135",
            },
            grade: "大三",
            college: "计网院",
            id: 1,
            joinDays: 233,
        },
    ]

    return memberList.reduce((prev, cur) => prev.concat(new Array(getRandomNum(5, 15)).fill(0).map(() => ({ ...cur, id: Math.random(), key: Math.random() }))), [] as ClubMemberTableRecordType[])
}

export interface ActivityTableRecordType
    extends Omit<ActivityFormStateType, "poster" | "title"> {
    titlePoster: {
        title: string;
        poster: string;
    };
    id: number;
    date: string
}
export async function getAllActivitiesOfClub(clubId: number) {
    await pause(getRandomNum(200, 600))
    const activities: ActivityTableRecordType[] = [
        {
            titlePoster: {
                title: '新生杯',
                poster: 'https://img1.baidu.com/it/u=50766702,1004057038&fm=253&fmt=auto&app=120&f=JPEG?w=889&h=500'
            },
            date: '2022-11-14',
            entryCondition: "凭邀请函",
            id: Math.random(),
            description: '这是关于此次活动的描述这是关于此次活动的描述这是关于此次活动的描述',
            location: '湘潭大学',
        },
        {
            titlePoster: {
                title: '新生杯',
                poster: 'https://img1.baidu.com/it/u=50766702,1004057038&fm=253&fmt=auto&app=120&f=JPEG?w=889&h=500'
            },
            date: '2022-11-14',
            entryCondition: "凭邀请函",
            id: Math.random(),
            description: '这是关于此次活动的描述这是关于此次活动的描述这是关于此次活动的描述',
            location: '湘潭大学',
        },
        {
            titlePoster: {
                title: '新生杯',
                poster: 'https://img1.baidu.com/it/u=50766702,1004057038&fm=253&fmt=auto&app=120&f=JPEG?w=889&h=500'
            },
            date: '2022-11-14',
            entryCondition: "凭邀请函",
            id: Math.random(),
            description: '这是关于此次活动的描述这是关于此次活动的描述这是关于此次活动的描述',
            location: '湘潭大学',
        }
    ]
    return activities
}
