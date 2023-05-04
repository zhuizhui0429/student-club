import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AllExceptionFilter } from './exceptioin.filter';
import { TransformInterceptor } from './interpector'
import { join } from 'path'
import * as express from 'express';
import { getDataSource } from './db'

export const port = 3000
export const staticDir = join(__dirname, '..', 'images')

async function bootstrap() {
  await getDataSource();
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://127.0.0.1:5173',
    methods: ['get', 'post']
  })
  app.use('/images', express.static(staticDir));
  app.useGlobalFilters(new AllExceptionFilter()); // 全局使用AllExceptionFilter处理错误
  app.useGlobalInterceptors(new TransformInterceptor(new Reflector()));
  const config = new DocumentBuilder()
    .setTitle('studentClub')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(3000);
}
bootstrap();
