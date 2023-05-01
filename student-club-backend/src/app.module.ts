import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubModule } from './club/club.module';
import { ActivityModule } from './activity/activity.module';
import { FileModule } from './fileModule'
import { MessageModule } from './message/message.module';
@Module({
  imports: [

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'zzxcxy666',
      //数据库名称必须用小写甚至驼峰都不行,否则在开启同步时就会出现表重复创建的问题
      database: 'student-club',
      synchronize: true,
      verboseRetryLog: true,
      retryAttempts: 3,
      retryDelay: 3000,
      timezone: '+08:00',
      autoLoadEntities: true
    }),
    UserModule,
    ClubModule,
    ActivityModule,
    FileModule,
    MessageModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
