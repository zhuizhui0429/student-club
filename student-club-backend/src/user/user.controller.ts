import { Controller, Get, Post, Body, Query, SetMetadata } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiTags, ApiBody, ApiQuery } from '@nestjs/swagger';
import type { RegisterPayloadType, LoginPayloadType } from './user.service';
import { RegisterPayloadExample, LoginPayloadExample } from './user.example'

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
  async getAllJoinedClubs(@Query('id') userId: number) {
    const res = await this.userService.getAllJoinedClubs(userId)
    return res
  }
}
