import { Module } from '@nestjs/common';

import { AppController } from './app.controller';

import { ComandaModule } from './comanda/comanda.module';

@Module({
  imports: [ComandaModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
