import { NestFactory } from '@nestjs/core';
import { AppModule } from './comandas/comanda.module';
require('dotenv-safe').config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000
  await app.listen(port);
}
bootstrap();
