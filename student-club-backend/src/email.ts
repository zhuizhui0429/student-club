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
    welcomeJoin: 'Welcome to the club',
    publishActivity: 'Your club has released a new activity',
    updateActivity: 'Your club has recently updated.'
}

const contentMap: Record<EmailType, string> = {
    welcomeJoin:
        `Welcome to the student club! We are thrilled to have you join us. We hope you will enjoy your time with us and make many new friends. If you have any questions or concerns, please don’t hesitate to ask. We are here to help you in any way we can.`,
    publishActivity: `“Hello everyone! We are excited to announce our new activity. We hope you can join us for this fun event. Please RSVP  so we can plan accordingly. If you have any questions or concerns, please don’t hesitate to ask. We look forward to seeing you there!”`,
    updateActivity: `“Hello everyone! We have an exciting update for you. We have added new activities to our schedule. Please check our website for more information. We hope you can join us for these fun events. If you have any questions or concerns, please don’t hesitate to ask. We look forward to seeing you there!”`
}

export const sendEmail = (payload: SendEmailPayloadType) => {
    const { clubName, type, to, activityName } = payload
    transporter.sendMail({
        from: `"${clubName}"<2301766839@qq.com>`, // sender address
        to, // list of receivers
        subject: subjectMap[type], // Subject line
        text: contentMap[type], // plain text body
    }).then(res => {
        console.log('sucesss', res)
    }).catch(err => {
        console.log('err', err)
    }).finally(() => {
        console.log('发送完成')
    })
}
