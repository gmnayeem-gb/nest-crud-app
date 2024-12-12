import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve static files from 'public' directory instead of 'public directory path'
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Set views directory to 'views' directory instead of 'views directory path'
  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  // Set the view engine to handlebars instead of ejs
  app.setViewEngine('hbs');

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
