import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToOne, OneToMany } from 'typeorm'
import { Club, Message } from '../entities'

export type UserType = 'student' | 'manager' | 'admin'
export type EmailReceiveConfig = 'both' | 'none' | 'onlyUpdate' | 'onlyPublish'

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ length: 30 })
    account: string

    @Column({ length: 30 })
    password: string

    @Column({ length: 10 })
    type: UserType

    @Column({ length: 100, nullable: true })
    email: string

    @Column({ length: 20, default: 'both' })
    emailReceiveConfig: EmailReceiveConfig

    @Column({ length: 200, default: 'https://img2.baidu.com/it/u=346152429,3164401706&fm=253&app=138&size=w931&n=0&f=JPG&fmt=auto?sec=1682874000&t=18b64f85a6e1017401418abba2a0f775' })
    avatar: string

    @Column({ length: 50, default: 'unnamed' })
    name: string

    @Column({ length: 50, default: '' })
    grade: string

    @Column({ length: 50, default: '' })
    college: string

    @Column({ length: 50, default: '' })
    description: string

    @Column({ type: 'timestamp', nullable: true })
    lastReadMessageTime: Date

    /**
     * 当该用户为学生时,其参加的所有俱乐部
     */
    @ManyToMany(() => Club, club => club.members)
    joinedClubs: Club[]

    @OneToOne(() => Club, club => club.manager)
    managerClub: Club

    /**
     *
     *用户接收到的所有消息(用户的俱乐部申请,经理的同意申请,用户的退出俱乐部提示)
     * @type {Message[]}
     * @memberof User
     */
    @OneToMany(() => Message, message => message.targetUser)
    messages: Message[]
}