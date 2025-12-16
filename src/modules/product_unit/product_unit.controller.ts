import {
  Controller,
  Get,
  Param,
  Res,
  UseGuards,
  HttpStatus
} from '@nestjs/common'
import { Response } from 'express'
import { AuthGuard } from 'src/middlewares/auth.guard'
import { ProductUnitService } from './product_unit.service'
import { NotFoundException, InternalServerErrorException } from '@nestjs/common'

@Controller('productUnit')
export class ProductUnitController {
  constructor(private readonly productUnitService: ProductUnitService) {}

  @Get('oneProductUnit/:cod_produto/:cod_unid')
  @UseGuards(AuthGuard)
  async getOneProductUnit(
    @Param('cod_produto') cod_produto: number,
    @Param('cod_unid') cod_unid: number,
    @Res() res: Response
  ) {
    try {
      const productUnit = await this.productUnitService.getOneProductUnit(
        cod_produto,
        cod_unid
      )
      return res.status(HttpStatus.OK).json(productUnit)
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: error.message })
      } else if (error instanceof InternalServerErrorException) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: error.message })
      } else {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Erro desconhecido' })
      }
    }
  }

  @Get('allProductUnits')
  @UseGuards(AuthGuard)
  async getAllProductUnits(@Res() res: Response) {
    try {
      const productUnits = await this.productUnitService.getAllProductUnits()
      return res.status(HttpStatus.OK).json(productUnits)
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message })
    }
  }
}
