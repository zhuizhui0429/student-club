import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User } from '../entities'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
    ) {
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
}

export type RegisterPayloadType = Pick<User, 'password' | 'account' | 'type'>

export type LoginPayloadType = Omit<RegisterPayloadType, 'type'>