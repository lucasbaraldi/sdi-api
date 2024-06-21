import { Module } from '@nestjs/common'

import { FirebirdClient } from 'src/firebird/firebird.client'
import { OrderController } from './order.controller'
import { OrderService } from './order.service'
import { OrderReleaseService } from './order-release.service'

@Module({
  imports: [],
  controllers: [OrderController],
  providers: [OrderService, OrderReleaseService, FirebirdClient]
})
export class OrderModule {}
