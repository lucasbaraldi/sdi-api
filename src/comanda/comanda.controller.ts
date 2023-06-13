import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { ComandaService } from './comanda.service'

@Controller()
export class ComandaController {
  constructor(private readonly comandaService: ComandaService) {}

  @Get('/clienteComanda/:nro_controle')
  clienteComanda(@Param('nro_controle') nro_controle: number) {
    return this.comandaService.clienteComanda(nro_controle)
  }
  @Get('/itensComanda/:nro_controle')
  itensComanda(@Param('nro_controle') nro_controle: number) {
    return this.comandaService.itensComanda(nro_controle)
  }

  @Post('/comandas/')
  comandas(@Body() body: any) {
    return this.comandaService.comandas(body)
  }
}
