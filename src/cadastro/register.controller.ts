import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards
} from '@nestjs/common'
import { RegisterService } from './register.service'

import { AuthGuard } from 'src/middlewares/auth.guard'

@Controller()
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Get('/produtos')
  produtos() {
    return this.registerService.produtos()
  }

  @Get('/produtosConsulta/:cod_empresa')
  @UseGuards(AuthGuard)
  produtosConsulta(@Param('cod_empresa') cod_empresa: number) {
    return this.registerService.produtosConsulta(cod_empresa)
  }

  @Get('/produto/:cod_produto')
  @UseGuards(AuthGuard)
  produto(@Param('cod_produto') cod_produto: number) {
    return this.registerService.produto(cod_produto)
  }

  @Get('/tabPreco/:cod_produto')
  @UseGuards(AuthGuard)
  tabPreco(@Param('cod_produto') cod_produto: number) {
    return this.registerService.tabPreco(cod_produto)
  }
  @Get('/tabelaPreco')
  @UseGuards(AuthGuard)
  tabPrecos() {
    return this.registerService.tabPrecos()
  }

  @Get('/clientes/:cod_empresa')
  clientes(@Param('cod_empresa') cod_empresa: number) {
    return this.registerService.clientes(cod_empresa)
  }

  @Get('/empresas')
  empresas() {
    return this.registerService.empresas()
  }

  @Get('/empresa/:cod_empresa')
  @UseGuards(AuthGuard)
  empresa(@Param('cod_empresa') cod_empresa: number) {
    return this.registerService.empresa(cod_empresa)
  }
  @Post('/precoVenda')
  @UseGuards(AuthGuard)
  precoVenda(@Body() body: any) {
    return this.registerService.precoVenda(body)
  }
}
