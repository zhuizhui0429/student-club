import { Module } from '@nestjs/common';
import { ClubService } from './club.service';
import { ClubController } from './club.controller';
import { Club } from '../entities'
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileModule } from '../fileModule'

@Module({
  imports: [TypeOrmModule.forFeature([Club]), FileModule],
  controllers: [ClubController],
  providers: [ClubService]
})
export class ClubModule { }
