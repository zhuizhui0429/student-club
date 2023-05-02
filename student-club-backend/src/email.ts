import * as nodeEmailer from 'nodemailer';

const transporter = nodeEmailer.createTransport({
    host: 'smtp.qq.com',
    port: 465,
    secure: true,
    auth: {
        user: '2301766839@qq.com',
        pass: 'wvgxwlwzcxdtecic'
    }
})

type EmailType = 'welcomeJoin' | 'publishActivity' | 'updateActivity'
interface SendEmailPayloadType {
    type: EmailType,
    to: string[],
    clubName: string
    activityName?: string
}

const subjectMap: Record<EmailType, string> = {
    welcomeJoin: '欢迎加入俱乐部',
    publishActivity: '你加入的俱乐部发布新活动了',
    updateActivity: '你加入的俱乐部最近更新了活动'
}

export const sendEmail = (payload: SendEmailPayloadType) => {
    const { clubName, type, to, activityName } = payload
    transporter.sendMail({
        from: `"${clubName} 俱乐部"<2301766839@qq.com>`, // sender address
        to, // list of receivers
        subject: subjectMap[type], // Subject line
        text: "这是邮箱内容", // plain text body
    }).then(res => {
        console.log('sucesss', res)
    }).catch(err => {
        console.log('err', err)
    }).finally(() => {
        console.log('发送完成')
    })
}
