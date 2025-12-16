import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { EstoqueService } from './estoque.service'
import { AuthGuard } from 'src/middlewares/auth.guard'

@ApiTags('Estoque')
@ApiBearerAuth('access-token')
@Controller()
export class EstoqueController {
  constructor(private readonly estoqueService: EstoqueService) {}

  @Get('/saldoProdutos')
  @UseGuards(AuthGuard)
  saldoProdutos() {
    return this.estoqueService.saldoProdutos()
  }
  @Get('/saldoProduto/:cod_produto')
  @UseGuards(AuthGuard)
  saldoProduto(@Param('cod_produto') cod_produto: number) {
    return this.estoqueService.saldoProduto(cod_produto)
  }
  @Post('/estoque')
  @UseGuards(AuthGuard)
  movtoEstoque(@Body() body: any) {
    return this.estoqueService.movtoEstoque(body)
  }
}
