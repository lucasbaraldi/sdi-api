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
import { UnitOfMeasurementService } from './unit-measurement.service'
import { NotFoundException, InternalServerErrorException } from '@nestjs/common'

@Controller('unitOfMeasurement')
export class UnitOfMeasurementController {
  constructor(
    private readonly unitOfMeasurementService: UnitOfMeasurementService
  ) {}

  @Get('oneUnitByCode/:cod_unid')
  @UseGuards(AuthGuard)
  async getUnit(@Param('cod_unid') cod_unid: number, @Res() res: Response) {
    try {
      const unit = await this.unitOfMeasurementService.getOneUnit(cod_unid)
      return res.status(HttpStatus.OK).json(unit)
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

  @Get('allUnits')
  @UseGuards(AuthGuard)
  async getAllUnits(@Res() res: Response) {
    try {
      const units = await this.unitOfMeasurementService.getAllUnits()
      return res.status(HttpStatus.OK).json(units)
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message })
    }
  }
}
