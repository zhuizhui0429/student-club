import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany } from 'typeorm'
import { User, Activity } from '../entities'

@Entity('club')
export class Club {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ length: 30 })
    clubName: string

    @Column({ length: 200 })
    description: string

    @Column({ length: 255 })
    poster: string

    /**
     * 该俱乐部的所有成员
     */
    @ManyToMany(() => User, user => user.joinedClubs)
    members: User[]

    /**
     *
     *该俱乐部举办的所有活动
     * @type {Activity[]}
     * @memberof Club
     */
    @OneToMany(() => Activity, activity => activity.club)
    activities: Activity[]
}
