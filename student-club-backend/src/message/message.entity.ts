import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { User } from '../entities'

export type MessageType = 'joinClubApplication' | 'exitClubTip' | 'joinClubApproval' | 'joinClubRefuse'
export type handleStatus = 'approved' | 'refused' | 'pending' | 'none'

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ length: 255 })
    senderAvatar: string

    @Column({ type: 'timestamp' })
    createTime: Date

    @Column({ length: 100 })
    senderName: string

    @Column()
    senderId: number

    @Column({ length: 100 })
    title: string

    @Column({ length: 100 })
    content: string

    @Column({ length: 25 })
    type: MessageType

    @Column({ length: 25, default: 'none' })
    handleStatus: handleStatus
    /**
     *
     *此条消息是发送给谁的
     * @type {User}
     * @memberof Message
     */
    @ManyToOne(() => User, user => user.messages)
    targetUser: User
}