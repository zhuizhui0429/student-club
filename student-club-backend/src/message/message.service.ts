import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Message, User } from '../entities'
import { getDataSource } from '../db'
import * as dayjs from 'dayjs'

@Injectable()
export class MessageService {
  dataSource: DataSource
  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    @InjectRepository(User) private userRepository: Repository<User>
  ) {
    getDataSource().then(ds => this.dataSource = ds)
  }

  async sendMessage(payload: SendMessagePayloadType) {
    const { targetId, type, senderId, ...rest } = payload
    const hasMessageUnhandled = await this.dataSource.getRepository(Message)
      .createQueryBuilder('message')
      .where('message.type = :type', { type })
      .andWhere('message.senderId = :senderId', { senderId })
      .andWhere('message.targetUserId = :targetId', { targetId })
      .andWhere(`message.handleStatus = :status`, { status: 'pending' })
      .getOne()

    if (hasMessageUnhandled) {
      throw new HttpException('你的上一条申请还未被俱乐部经理受理,请勿重复申请', HttpStatus.FORBIDDEN)
    }

    const messageEntity = await this.messageRepository.save({ ...rest, type, senderId, createTime: new Date(), handleStatus: type === 'joinClubApplication' ? 'pending' : 'none' })
    await this.dataSource.createQueryBuilder()
      .relation(Message, 'targetUser')
      .of(messageEntity)
      .set(targetId)
    return messageEntity
  }

  async getAllMessage(userId: number) {
    const userEntity = await this.userRepository.findOne({
      where: {
        id: userId
      }
    })
    const { lastReadMessageTime } = userEntity
    const lastReadTime = dayjs(new Date(lastReadMessageTime))
    const messageEntities: Message[] = await this.messageRepository.find({
      where: {
        targetUser: userEntity
      },
      order: {
        createTime: 'DESC'
      }
    })

    const res: Array<MessageResType> = messageEntities.map(message => {
      const { createTime, ...rest } = message
      return {
        ...rest,
        createTime,
        hasRead: lastReadTime.isAfter(dayjs(createTime))
      }
    })
    return res
  }
}

export interface SendMessagePayloadType extends Pick<Message, 'senderAvatar' | 'senderName' | 'title' | 'content' | 'type' | 'senderId'> {
  targetId: number
}

export interface MessageResType extends Pick<Message, 'senderAvatar' | 'senderName' | 'title' | 'content' | 'type' | 'createTime' | 'senderId'> {
  hasRead: boolean
}
