import { Module } from '@nestjs/common';

import { ComandaController } from './comanda.controller';
import { ComandaService } from './comanda.service';

import { FirebirdClient } from 'src/firebird/firebird.client';

@Module({
  imports: [],
  controllers: [ComandaController],
  providers: [ComandaService, FirebirdClient],
})
export class ComandaModule {}
