import { Controller, Get, Post, Body, Query, SetMetadata, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger';
import type { RegisterPayloadType, LoginPayloadType, UpdateUserInfoPayloadType, UpdateEmailReceiveConfigPayloadType } from './user.service';
import { RegisterPayloadExample, LoginPayloadExample } from './user.example'
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
@ApiTags('用户模块')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('/register')
  @ApiOperation({ description: '注册学生和俱乐部经理' })
  @SetMetadata('successMessage', '注册成功')
  @ApiBody({ schema: { example: RegisterPayloadExample } })
  async register(@Body() info: RegisterPayloadType) {
    return await this.userService.register(info)
  }

  @Post('/login')
  @ApiOperation({ description: '用户登录' })
  @SetMetadata('successMessage', '登录成功')
  @ApiBody({ schema: { example: LoginPayloadExample } })
  async login(@Body() data: LoginPayloadType) {
    const res = await this.userService.login(data)
    return res
  }

  @Get('/joinedClubs')
  @ApiOperation({ description: '获取学生用户加入的所有俱乐部' })
  @SetMetadata('successMessage', '获取成功')
  async getAllJoinedClubs(@Query('userId') userId: number) {
    const res = await this.userService.getAllJoinedClubs(userId)
    return res
  }

  @Post('updateInfo')
  @ApiOperation({ description: '更新用户信息' })
  @SetMetadata('successMessage', '更新成功')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateUserInfo(@UploadedFile() poster: Express.Multer.File & { url: string }, @Body() payload: Omit<UpdateUserInfoPayloadType, 'avatar'>) {
    const { url } = poster || {}
    const res = await this.userService.updateUserInfo({ ...payload, avatar: url })
    return res
  }

  @Get('allManagers')
  @ApiOperation({ description: '获取所有角色为俱乐部经理的用户' })
  @SetMetadata('successMessage', '获取成功')
  async getAllManagers() {
    const res = await this.userService.getAllManagers()
    return res
  }

  @Get('updateReadMessageTime')
  @ApiOperation({ description: '更新上次阅读消息的时间' })
  @SetMetadata('successMessage', '更新成功')
  async updateReadMessageTime(@Query('userId') userId: number) {
    const res = await this.userService.updateReadMessageTime(userId)
    return res
  }

  @Post('updateEmailReceiveConfig')
  @ApiOperation({ description: '更新用户接受邮件通知的配置' })
  @SetMetadata('successMessage', '邮件通知设置更新成功')
  async updateEmailReceiveConfig(@Body() payload: UpdateEmailReceiveConfigPayloadType) {
    const { id, config } = payload
    const res = await this.userService.updateEmailReceiveConfig({
      id,
      config
    })
    return res
  }

}
