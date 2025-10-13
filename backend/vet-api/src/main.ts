import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config/envs';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('main')
  app.setGlobalPrefix('api');



  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    }),
  )

  await app.listen(envs.port);
  logger.log(`Application running on port: ${envs.port}`);
}
bootstrap();
