import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { PriceTableService } from './price-table.service'

import { AuthGuard } from 'src/middlewares/auth.guard'

@Controller('priceTable')
export class PriceTableController {
  constructor(private readonly PriceTableService: PriceTableService) {}

  @Get('oneTableByProduct/:cod_produto')
  @UseGuards(AuthGuard)
  tabPreco(@Param('cod_produto') cod_produto: number) {
    return this.PriceTableService.tabPreco(cod_produto)
  }
  @Get('alltables')
  @UseGuards(AuthGuard)
  tabPrecos() {
    return this.PriceTableService.tabPrecos()
  }

  @Post('precoVenda')
  @UseGuards(AuthGuard)
  precoVenda(@Body() body: any) {
    return this.PriceTableService.precoVenda(body)
  }
}
