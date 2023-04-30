import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { Club } from '../entities'

export type entryCondition = '免费' | '凭邀请函'

@Entity('activity')
export class Activity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ length: 30 })
    title: string

    @Column({ length: 200 })
    description: string

    @Column({ length: 255 })
    poster: string

    @Column({ length: 100 })
    location: string

    @Column({ length: 10 })
    entryCondition: entryCondition

    @Column({ length: 100 })
    date: string

    /**
     * 该活动所属俱乐部
     */
    @ManyToOne(() => Club, club => club.activities)
    club: Club
}
