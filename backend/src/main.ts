import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import { resolve } from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule); //  typed as NestExpressApplication
  const configService = app.get(ConfigService); // Get ConfigService instance
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // makes files accessible at
  });

  app.use('/uploads', express.static(resolve('uploads')));

  const config = new DocumentBuilder()
    .setTitle('Events API')
    .setDescription('API for managing events')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'evolution', // This is the name of the security scheme
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Visit http://localhost:3000/api
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
}
bootstrap();
