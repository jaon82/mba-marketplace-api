import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Env } from './env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const envService = app.get<ConfigService<Env, true>>(ConfigService);
  const port = envService.get('PORT', { infer: true });
  await app.listen(port);
}
bootstrap();
