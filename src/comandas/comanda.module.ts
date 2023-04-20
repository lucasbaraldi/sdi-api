import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './comanda.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
