import { Controller, Post, Get, SetMetadata, Body, Query } from '@nestjs/common';
import { MessageService } from './message.service';
import { ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger';
import type { SendMessagePayloadType } from './message.service'
import { sendMessageExample } from './message.example'

@Controller('message')
@ApiTags('消息模块')
export class MessageController {
  constructor(private readonly messageService: MessageService) { }

  @Post('send')
  @ApiOperation({ description: '发送消息' })
  @SetMetadata('successMessage', 'Sent successfully')
  @ApiBody({ schema: { example: sendMessageExample } })
  async sendMessage(@Body() payload: SendMessagePayloadType) {
    const res = await this.messageService.sendMessage(payload)
    return res
  }

  @Get('getAll')
  @ApiOperation({ description: '获取某个用户的所有消息' })
  @SetMetadata('successMessage', 'Get the message successfully')
  async getAllMessage(@Query('userId') userId: number) {
    const res = await this.messageService.getAllMessage(userId)
    return res
  }

}
