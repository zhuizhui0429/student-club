import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToOne } from 'typeorm'
import { Club } from '../entities'

export type UserType = 'student' | 'manager' | 'admin'

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

    @Column({ length: 200, default: 'https://img2.baidu.com/it/u=346152429,3164401706&fm=253&app=138&size=w931&n=0&f=JPG&fmt=auto?sec=1682874000&t=18b64f85a6e1017401418abba2a0f775' })
    avatar: string

    @Column({ length: 50, default: '' })
    name: string

    @Column({ length: 50, default: '' })
    grade: string

    @Column({ length: 50, default: '' })
    college: string

    @Column({ length: 50, default: '' })
    description: string

    /**
     * 当该用户为学生时,其参加的所有俱乐部
     */
    @ManyToMany(() => Club, club => club.members)
    joinedClubs: Club[]

    @OneToOne(() => Club, club => club.manager)
    managerClub: Club
}