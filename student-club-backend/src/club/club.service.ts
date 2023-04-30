import { Injectable } from '@nestjs/common';
import { Club, Activity, User } from '../entities'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { getDataSource } from '../db'

@Injectable()
export class ClubService {
    dataSource: DataSource
    constructor(
        @InjectRepository(Club) private clubRepository: Repository<Club>
    ) {
        getDataSource().then(ds => this.dataSource = ds)
    }

    async createClub(payload: CreateClubPayloadType) {
        const { managerId, ...clubInfo } = payload
        const clubEntity = await this.clubRepository.save(clubInfo)
        await this.dataSource.createQueryBuilder()
            .relation(Club, 'manager')
            .of(clubEntity)
            .set(managerId)
        return clubEntity
    }

    async getAllClubPreviewInfo(): Promise<GetAllClubPreviewInfoResType> {
        const allClubEntity = await this.clubRepository.find()
        return allClubEntity.map(({ clubName, id, poster, description }) => ({ clubName, id, poster, description }))
    }

    async getAllActivities(clubId: number) {
        const res: Activity[] = await this.dataSource.createQueryBuilder()
            .relation(Club, 'activities')
            .of(clubId)
            .loadMany()
        return res
    }

    async getMembersOfClub(clubId: number) {
        const entities: User[] = await this.dataSource.createQueryBuilder()
            .relation(Club, 'members')
            .of(clubId)
            .loadMany()
        const members: getMembersOfClubResType = entities.map(({ avatar, college, grade, id, name }) => ({ id,name,avatar, college, grade }))
        return members
    }

    async joinClub(userId: number, clubId: number) {
        return await this.dataSource.createQueryBuilder()
            .relation(Club, 'members')
            .of(clubId)
            .add(userId)
    }

    async judgeIsJoin(userId: number, clubId: number) {
        const res = await this.dataSource.getRepository(Club)
            .createQueryBuilder('club')
            .leftJoinAndSelect('club.members', 'member')
            .where("club.id = :clubId", { clubId })
            .andWhere("member.id = :userId", { userId })
            .getOne()
        return Boolean(res)
    }
}

export interface CreateClubPayloadType extends Pick<Club, 'clubName' | 'description' | 'poster'> {
    managerId: number
}

export type GetAllClubPreviewInfoResType = Array<Pick<Club, 'clubName' | 'id' | 'poster' | 'description'>>

export type getMembersOfClubResType = Array<Pick<User, 'avatar' | 'college' | 'grade'>>
