import { Module } from '@nestjs/common'

import { AppController } from './app.controller'

import { ComandaModule } from './comanda/comanda.module'
import { AuthModule } from './Auth/auth.module'
import { RegisterModule } from './cadastro/register.module'
import { EstoqueModule } from './estqoue/estoque.module'

@Module({
  imports: [ComandaModule, AuthModule, RegisterModule, EstoqueModule],
  controllers: [AppController],
  providers: []
})
export class AppModule {}
