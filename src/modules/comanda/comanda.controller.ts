import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { ComandaService } from './comanda.service'
import { CreateComandaDto } from './dto/create-comanda.dto'

@ApiTags('Comanda')
@ApiBearerAuth('access-token')
@Controller('comanda')
export class ComandaController {
  constructor(private readonly comandaService: ComandaService) {}

  @Get('/clienteComanda/:nro_controle')
  clienteComanda(@Param('nro_controle') nro_controle: number) {
    return this.comandaService.clienteComanda(nro_controle)
  }

  @Get('/allClientsByCodEmpresa/:cod_empresa')
  clientes(@Param('cod_empresa') cod_empresa: number) {
    return this.comandaService.clientes(cod_empresa)
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

  @Get('/produtos')
  produtos() {
    return this.comandaService.produtos()
  }

  @Post('/comandas')
  @ApiOperation({ summary: 'Criar uma nova comanda' })
  @ApiResponse({ status: 201, description: 'Comanda criada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  comandas(@Body() createComandaDto: CreateComandaDto) {
    console.log(createComandaDto)
    return this.comandaService.comandas(createComandaDto)
  }
}
