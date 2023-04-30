import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User } from '../entities'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { getDataSource } from '../db'


@Injectable()
export class UserService {
    dataSource: DataSource
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
    ) {
        getDataSource().then(ds => this.dataSource = ds)
    }

    async register(data: RegisterPayloadType) {
        const { account } = data
        const hasExit = await this.userRepository.findOne({
            where: {
                account
            }
        })
        if (hasExit) {
            throw new HttpException('当前账号已被注册,请更换其他账号', HttpStatus.FORBIDDEN)
        }
        return await this.userRepository.save(data)
    }

    async login(data: LoginPayloadType) {
        const { account, password } = data
        const userInfo = await this.userRepository.findOne({
            where: {
                account,
                password
            }
        })
        if (!userInfo) {
            throw new HttpException('账号或密码不正确,请重新登录', HttpStatus.FORBIDDEN)
        }
        return userInfo
    }

    async getAllJoinedClubs(id: number) {
        return await this.dataSource.createQueryBuilder()
            .relation(User, 'joinedClubs')
            .of(id)
            .loadMany()
    }

    async updateUserInfo(data: UpdateUserInfoPayloadType) {
        const { id, avatar, originalAvatar, ...rest } = data
        await this.userRepository.update({
            id
        }, {
            avatar: avatar || originalAvatar,
            ...rest
        })
        const user = await this.userRepository.findOne({
            where: { id }
        })
        return user
    }

    async getAllManagers() {
        const userEntities = await this.userRepository.find({
            where: {
                type: 'manager'
            },
            relations: ['managerClub']
        })

        const res: GetAllManagersResType =
            userEntities.map(({ id, name, managerClub }) => ({ id, name, managerClubName: managerClub?.clubName }))
        return res
    }

}

export type RegisterPayloadType = Pick<User, 'password' | 'account' | 'type'>

export type LoginPayloadType = Omit<RegisterPayloadType, 'type'>

export interface UpdateUserInfoPayloadType extends Pick<User, 'avatar' | 'college' | 'description' | 'grade' | 'name' | 'id'> {
    originalAvatar: string
}

export type GetAllManagersResType = Array<{
    id: number
    name: string
    managerClubName?: string
}>