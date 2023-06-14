import { Module } from '@nestjs/common'

import { FirebirdClient } from 'src/firebird/firebird.client'
import { EstoqueController } from './estoque.controller'
import { EstoqueService } from './estoque.service'

@Module({
  imports: [],
  controllers: [EstoqueController],
  providers: [EstoqueService, FirebirdClient]
})
export class EstoqueModule {}
