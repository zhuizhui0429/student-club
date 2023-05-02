import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity, User, Club } from '../entities'
import { getDataSource } from '../db'
import { Repository, DataSource } from 'typeorm';
import { formatDate } from '../utils'
import { sendEmail } from '../email'
@Injectable()
export class ActivityService {
    dataSource: DataSource
    constructor(
        @InjectRepository(Activity) private activityRepository: Repository<Activity>,
        @InjectRepository(User) private userRepository: Repository<User>
    ) {
        getDataSource().then(ds => this.dataSource = ds)
    }

    async createActivity(payload: CreateActivityPayloadType) {
        const { managerId, ...rest } = payload
        const { id: clubId, clubName } = await this.dataSource.createQueryBuilder().relation(User, 'managerClub').of(managerId).loadOne<Club>()

        const activityEntity = await this.activityRepository.save({ ...rest, date: formatDate(new Date()) })
        await this.dataSource.createQueryBuilder()
            .relation(Activity, 'club')
            .of(activityEntity)
            .set(clubId)

        const members = await this.dataSource.createQueryBuilder().relation(Club, 'members').of(clubId).loadMany<User>()
        const receiverEmails = members.filter(member => member.email && ['both', 'publish'].includes(member.emailReceiveConfig)).map(member => member.email)
        console.log('发布活动:receiverEmails', receiverEmails)
        sendEmail({
            type: 'publishActivity',
            to: receiverEmails,
            activityName: payload.title,
            clubName
        })
        return activityEntity
    }

    async updateActivity(payload: UpdateActivityPayloadType) {
        const { id, title, description, poster, originalPoster, entryCondition, location } = payload
        const { id: clubId, clubName } = await this.dataSource.createQueryBuilder().relation(Activity, 'club').of(id).loadOne<Club>()

        const members = await this.dataSource.createQueryBuilder().relation(Club, 'members').of(clubId).loadMany<User>()
        const receiverEmails = members.filter(member => member.email && ['both', 'publish'].includes(member.emailReceiveConfig)).map(member => member.email)
        sendEmail({
            type: 'updateActivity',
            to: receiverEmails,
            activityName: payload.title,
            clubName
        })
        return await this.activityRepository.update({
            id
        }, {
            title,
            description,
            entryCondition,
            location,
            poster: poster || originalPoster
        })
    }
}

export interface CreateActivityPayloadType extends Pick<Activity, 'title' | 'description' | 'poster' | 'location' | 'entryCondition' | 'date'> {
    managerId: number
}

export interface UpdateActivityPayloadType extends Omit<CreateActivityPayloadType, 'date' | 'poster'> {
    poster?: string
    id: number
    originalPoster?: string
}
