import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity,User } from '../entities'
import { FileModule } from '../fileModule'

@Module({
  imports: [TypeOrmModule.forFeature([Activity,User]),FileModule],
  controllers: [ActivityController],
  providers: [ActivityService]
})
export class ActivityModule { }
