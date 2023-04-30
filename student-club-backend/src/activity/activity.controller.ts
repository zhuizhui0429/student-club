import { ActivityService } from './activity.service';
import { Controller, Get, Post, Body, UseInterceptors, UploadedFile, SetMetadata } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import type { CreateActivityPayloadType, UpdateActivityPayloadType } from './activity.service'

@Controller('activity')
@ApiTags('活动模块')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) { }

  @Post('create')
  @ApiOperation({ description: '创建活动' })
  @SetMetadata('successMessage', '创建活动成功')
  @UseInterceptors(FileInterceptor('image'))
  async createClub(@UploadedFile() poster: Express.Multer.File & { url: string }, @Body() payload: Omit<CreateActivityPayloadType, 'poster'>) {
    const { url } = poster
    console.log('创建活动 payload', payload)
    const res = await this.activityService.createActivity({ poster: url, ...payload })
    return res
  }

  @Post('update')
  @ApiOperation({ description: '更新活动' })
  @SetMetadata('successMessage', '更新活动成功')
  @UseInterceptors(FileInterceptor('image'))
  async updateActivity(@UploadedFile() poster: Express.Multer.File & { url: string }, @Body() payload: Omit<UpdateActivityPayloadType, 'poster'>) {
    const { url } = poster || {}
    const res = await this.activityService.updateActivity({ poster: url, ...payload })
    return res
  }

}
