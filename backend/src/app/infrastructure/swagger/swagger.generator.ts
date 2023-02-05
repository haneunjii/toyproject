import { INestApplication } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { tags } from './swagger.tags';

const document = new DocumentBuilder()
  .setTitle(`COMMUNITY APP API`)
  .setDescription('커뮤니티 앱 API 문서')
  .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
  .setVersion('1.0.0');

tags.forEach((tag) => document.addTag(tag.name, tag.description));

export default function generateSwaggerDocument(
  app: NestApplication | INestApplication,
) {
  return SwaggerModule.createDocument(app, document.build());
}
