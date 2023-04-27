import { pause, getRandomNum } from './'

export interface MessageItemType {
    avatar: string
    clubName: string
    activityName: string
    date: string
    content: string
    hasRead: boolean
    id: number
}

export async function getAllMessage(userId: number): Promise<MessageItemType[]> {
    await pause(getRandomNum(300, 600))
    const messages: MessageItemType[] = [
        {
            avatar: 'https://t7.baidu.com/it/u=2204874366,1447142724&fm=193&f=GIF',
            clubName: '健身俱乐部',
            activityName: '第一届硬拉比赛',
            content: '即将举项第一届硬拉比赛，欢迎大家参加',
            hasRead: true,
            date: '2023-12-08 16:45',
            id: Math.random()
        },
        {
            avatar: 'https://img0.baidu.com/it/u=248732139,2098859720&fm=253&fmt=auto&app=138&f=JPEG?w=704&h=500',
            clubName: '篮球俱乐部',
            activityName: '卓越杯比赛',
            content: '即将举项第一届教职工比赛，欢迎大家参加',
            hasRead: false,
            date: '2023-12-08 16:45',
            id: Math.random()
        }
    ]
    return messages.reduce((prev, cur) => prev.concat(new Array(getRandomNum(3, 8)).fill(0).map(() => ({ ...cur, id: Math.random(), hasRead: Math.random() > 0.5 }))), [] as MessageItemType[])
}