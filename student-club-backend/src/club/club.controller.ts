import { Controller, Get, Post, Body, Query, UseInterceptors, UploadedFile, SetMetadata } from '@nestjs/common';
import { ClubService } from './club.service';
import { ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger';
import type { CreateClubPayloadType, ApproveJoinPayloadType, RefuseJoinPayloadType } from './club.service'
import { FileInterceptor } from '@nestjs/platform-express';
import { JoinClubExample, JudgeIsJoinExample } from './club.example'

@Controller('club')
@ApiTags('俱乐部模块')
export class ClubController {
  constructor(private readonly clubService: ClubService) { }

  @Post('create')
  @ApiOperation({ description: '创建俱乐部' })
  @SetMetadata('successMessage', '创建俱乐部成功')
  @UseInterceptors(FileInterceptor('image'))
  async createClub(@UploadedFile() poster: Express.Multer.File & { url: string }, @Body() payload: Omit<CreateClubPayloadType, 'poster'>) {
    const { url } = poster
    const res = await this.clubService.createClub({ poster: url, ...payload })
    return res
  }

  @Get('allPreviewInfo')
  @ApiOperation({ description: '获取所有俱乐部的预览信息' })
  @SetMetadata('successMessage', '获取成功')
  async getAllClubPreviewInfo() {
    const res = await this.clubService.getAllClubPreviewInfo()
    return res
  }

  @Get('allActivities')
  @ApiOperation({ description: '获取某个俱乐部的所有活动' })
  @SetMetadata('successMessage', '获取成功')
  async getAllActivitiesOfClub(@Query('managerId') managerId: number) {
    const res = await this.clubService.getAllActivities(managerId)
    return res
  }

  @Get('members')
  @ApiOperation({ description: '获取某个俱乐部的所有成员' })
  @SetMetadata('successMessage', '获取成功')
  async getMemberCountOfClub(@Query('managerId') clubId: number) {
    console.log('id', clubId)
    const res = await this.clubService.getMembersOfClub(clubId)
    return res
  }

  @Get('allActivitiesByClubId')
  @ApiOperation({ description: '获取某个俱乐部的所有活动' })
  @SetMetadata('successMessage', '获取成功')
  async getAllActivitiesByClubId(@Query('clubId') id: number) {
    const res = await this.clubService.getActivitiesByClubId(id)
    return res
  }

  @Get('membersByClubId')
  @ApiOperation({ description: '获取某个俱乐部的所有成员' })
  @SetMetadata('successMessage', '获取成功')
  async getMembersByClubId(@Query('clubId') clubId: number) {
    const res = await this.clubService.getMembersByClubId(clubId)
    return res
  }

  @Post('join')
  @ApiOperation({ description: '加入俱乐部' })
  @SetMetadata('successMessage', '加入成功')
  @ApiBody({ schema: { example: JoinClubExample } })
  async JoinClub(@Body() payload: typeof JoinClubExample) {
    const { clubId, userId } = payload
    const res = await this.clubService.joinClub(userId, clubId)
    return res
  }

  @Post('judgeIsJoin')
  @ApiOperation({ description: '判断用户是否加入某个俱乐部' })
  @SetMetadata('successMessage', '判断成功')
  @ApiBody({ schema: { example: JudgeIsJoinExample } })
  async judgeIsJoin(@Body() payload: typeof JudgeIsJoinExample) {
    const { clubId, userId } = payload
    const res = await this.clubService.judgeIsJoin(userId, clubId)
    return res
  }

  @Post('approveJoin')
  @ApiOperation({ description: '批准用户加入俱乐部的申请' })
  @SetMetadata('successMessage', '已同意加入')
  async approveJoin(@Body() payload: ApproveJoinPayloadType) {
    const res = await this.clubService.approveJoin(payload)
    return res
  }

  @Post('refuseJoin')
  @ApiOperation({ description: '拒绝用户加入俱乐部的申请' })
  @SetMetadata('successMessage', '已拒绝加入')
  async refuseJoin(@Body() payload: RefuseJoinPayloadType) {
    const res = await this.clubService.refuseJoin(payload)
    return res
  }


}