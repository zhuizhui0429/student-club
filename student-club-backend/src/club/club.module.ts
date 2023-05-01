import { Module } from '@nestjs/common';
import { ClubService } from './club.service';
import { ClubController } from './club.controller';
import { Club, Message, User } from '../entities'
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileModule } from '../fileModule'

@Module({
  imports: [TypeOrmModule.forFeature([Club, Message, User]), FileModule],
  controllers: [ClubController],
  providers: [ClubService]
})
export class ClubModule { }
