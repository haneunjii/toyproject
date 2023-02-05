import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';

import { MainModule } from './main.module';

import generateSwaggerDocument from '@app/infrastructure/swagger/swagger.generator';

(async () => {
  const app = await NestFactory.create(MainModule);

  SwaggerModule.setup('docs', app, generateSwaggerDocument(app), {
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(process.env.APP_PORT || 3000, '' + '0.0.0.0');
})();
