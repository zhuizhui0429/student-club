import { Injectable } from '@nestjs/common';
import { Club, Activity, User, Message } from '../entities'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { getDataSource } from '../db'

@Injectable()
export class ClubService {
    dataSource: DataSource
    constructor(
        @InjectRepository(Club) private clubRepository: Repository<Club>,
        @InjectRepository(Message) private messageRepository: Repository<Message>,
        @InjectRepository(User) private userRepository: Repository<User>,
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
        const allClubEntity = await this.clubRepository.find({
            relations: ['manager']
        })
        return allClubEntity.map(({ clubName, id, poster, description, manager: { id: managerId } }) => ({ clubName, id, poster, description, managerId }))
    }

    async getAllActivities(managerId: number) {
        const { id: clubId } = await this.dataSource.createQueryBuilder().relation(User, 'managerClub').of(managerId).loadOne<Club>()
        const res: Activity[] = await this.dataSource.createQueryBuilder()
            .relation(Club, 'activities')
            .of(clubId)
            .loadMany()
        return res
    }

    async getMembersOfClub(managerId: number) {
        const { id: clubId } = await this.dataSource.createQueryBuilder().relation(User, 'managerClub').of(managerId).loadOne<Club>()
        const entities: User[] = await this.dataSource.createQueryBuilder()
            .relation(Club, 'members')
            .of(clubId)
            .loadMany()
        const members: getMembersOfClubResType = entities.map(({ avatar, college, grade, id, name }) => ({ id, name, avatar, college, grade }))
        return members
    }

    async getActivitiesByClubId(id: number) {
        const res: Activity[] = await this.dataSource.createQueryBuilder()
            .relation(Club, 'activities')
            .of(id)
            .loadMany()
        return res
    }

    async getMembersByClubId(id: number) {
        const entities: User[] = await this.dataSource.createQueryBuilder()
            .relation(Club, 'members')
            .of(id)
            .loadMany()
        const members: getMembersOfClubResType = entities.map(({ avatar, college, grade, id, name }) => ({ id, name, avatar, college, grade }))
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

    async approveJoin(payload: ApproveJoinPayloadType) {
        const { applicantId, managerId, applicantMessageId } = payload
        const clubEntity = await this.dataSource.getRepository(Club)
            .createQueryBuilder('club')
            .where("club.managerId = :managerId", { managerId })
            .getOne()
        const { id: senderId, name: senderName, avatar: senderAvatar } = await this.userRepository.findOne({
            where: { id: managerId }
        })
        const [, messageEntity] = await Promise.all([
            this.dataSource.createQueryBuilder().relation(Club, 'members').of(clubEntity).add(applicantId),
            this.messageRepository.save({
                senderId,
                senderName,
                senderAvatar,
                type: 'joinClubApproval',
                title: '同意了你的入部申请',
                content: `欢迎加入${clubEntity.clubName}大家提`,
                createTime: new Date()
            }),
            this.messageRepository.update({
                id: applicantMessageId
            }, {
                handleStatus: 'approved'
            })
        ])
        await this.dataSource.createQueryBuilder().relation(Message, 'targetUser').of(messageEntity).set(applicantId)
        return messageEntity
    }

    async refuseJoin(payload: RefuseJoinPayloadType) {
        const { managerId, applicantId, applicantMessageId, reason } = payload
        const { id: senderId, name: senderName, avatar: senderAvatar } = await this.userRepository.findOne({
            where: {
                id: managerId
            }
        })
        const [, messageEntity] = await Promise.all([
            this.messageRepository.update({
                id: applicantMessageId,
            }, {
                handleStatus: 'refused'
            }),
            this.messageRepository.save({
                senderId,
                senderAvatar,
                senderName,
                title: '拒绝了你的入部申请',
                content: reason || '',
                targetId: applicantId,
                type: 'joinClubRefuse'
            })
        ])
        await this.dataSource.createQueryBuilder().relation(Message, 'targetUser').of(messageEntity).set(applicantId)
    }
}

export interface CreateClubPayloadType extends Pick<Club, 'clubName' | 'description' | 'poster'> {
    managerId: number
}

export type GetAllClubPreviewInfoResType = Array<Pick<Club, 'clubName' | 'id' | 'poster' | 'description'> & { managerId: number }>

export type getMembersOfClubResType = Array<Pick<User, 'avatar' | 'college' | 'grade'>>

export interface ApproveJoinPayloadType {
    applicantMessageId: number
    applicantId: number
    managerId: number
}

export interface RefuseJoinPayloadType extends ApproveJoinPayloadType {
    reason: string
}

