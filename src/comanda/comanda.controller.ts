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

  @Get('/comandas/:nro_controle')
  getComandas(@Param('nro_controle') nro_controle: number) {
    return this.comandaService.getComandas(nro_controle)
  }

  @Get('/cardapio')
  cardapio() {
    return this.comandaService.cardapio()
  }

  @Get('/finalizacao')
  finalizacao() {
    return this.comandaService.finalizacao()
  }

  @Get('/barSegmentos')
  barSegmentos() {
    return this.comandaService.barSegmentos()
  }

  @Get('/barGrupos')
  barGrupos() {
    return this.comandaService.barGrupos()
  }

  @Post('/comandas')
  comandas(@Body() body: any) {
    return this.comandaService.comandas(body)
  }
}
