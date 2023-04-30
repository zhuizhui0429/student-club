import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from '../entities'
import { getDataSource } from '../db'
import { Repository, DataSource } from 'typeorm';
import { formatDate } from '../utils'
@Injectable()
export class ActivityService {
    dataSource: DataSource
    constructor(
        @InjectRepository(Activity) private activityRepository: Repository<Activity>
    ) {
        getDataSource().then(ds => this.dataSource = ds)
    }

    async createActivity(payload: CreateActivityPayloadType) {
        const { clubId, ...rest } = payload
        const activityEntity = await this.activityRepository.save({ ...rest, date: formatDate(new Date()) })
        console.log('clubId', clubId)
        await this.dataSource.createQueryBuilder()
            .relation(Activity, 'club')
            .of(activityEntity)
            .set(clubId)
        return activityEntity
    }

    async updateActivity(payload: UpdateActivityPayloadType) {
        const { id, title, description, poster, originalPoster, entryCondition, location } = payload
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
    clubId: number
}

export interface UpdateActivityPayloadType extends Omit<CreateActivityPayloadType, 'date' | 'clubId' | 'poster'> {
    poster?: string
    id: number
    originalPoster?: string
}
