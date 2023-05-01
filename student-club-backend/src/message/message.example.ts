import type { SendMessagePayloadType } from './message.service'

export const sendMessageExample: SendMessagePayloadType = {
    senderId: 1,
    senderName: '周志祥',
    senderAvatar: 'https://img1.baidu.com/it/u=1889141371,3742825600&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1682960400&t=a09415e1a1203bece63b0ca9ce301ce4',
    title: '申请加入篮球俱乐部',
    content: '教练我想打篮球',
    targetId: 2,
    type: 'joinClubApplication'
}