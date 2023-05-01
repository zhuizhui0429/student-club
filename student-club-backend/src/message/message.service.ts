import { Injectable } from '@nestjs/common';
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
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    getDataSource().then(ds => this.dataSource = ds)
  }

  async sendMessage(payload: SendMessagePayloadType) {
    const { targetId, type, ...rest } = payload
    const messageEntity = await this.messageRepository.save({ ...rest, type, createTime: new Date(), handleStatus: type === 'joinClubApplication' ? 'pending' : 'none' })
    const res = await this.dataSource.createQueryBuilder()
      .relation(Message, 'targetUser')
      .of(messageEntity)
      .set(targetId)
    return res
  }

  async getAllMessage(userId: number) {
    const { lastReadMessageTime } = await this.userRepository.findOne({
      where: {
        id: userId
      }
    })
    const lastReadTime = dayjs(new Date(lastReadMessageTime))
    const messageEntities: Message[] = await this.dataSource.createQueryBuilder()
      .relation(User, 'messages')
      .of(userId)
      .loadMany()

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
