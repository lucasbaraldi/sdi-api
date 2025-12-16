import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ProductService } from './product.service'

import { AuthGuard } from 'src/middlewares/auth.guard'

@ApiTags('Product')
@ApiBearerAuth('access-token')
@Controller('product')
export class ProductController {
  constructor(private readonly ProductService: ProductService) {}

  @Get('/produtosConsulta/:cod_empresa')
  @UseGuards(AuthGuard)
  produtosConsulta(@Param('cod_empresa') cod_empresa: number) {
    return this.ProductService.produtosConsulta(cod_empresa)
  }

  @Get('/produto/:cod_produto')
  @UseGuards(AuthGuard)
  produto(@Param('cod_produto') cod_produto: number) {
    return this.ProductService.produto(cod_produto)
  }
}
