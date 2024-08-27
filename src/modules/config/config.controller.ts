// config.controller.ts
import {
  Controller,
  Get,
  Query,
  UseGuards,
  Logger,
  BadRequestException
} from '@nestjs/common'

import { ConfigWhats } from './entities/config-whats.entity'
import { ConfigService } from './config.sevice'
import { AuthGuard } from 'src/middlewares/auth.guard'

@Controller('config')
export class ConfigController {
  private readonly logger = new Logger(ConfigController.name)

  constructor(private readonly configService: ConfigService) {}

  @Get('whats')
  @UseGuards(AuthGuard)
  async getConfigWhats(
    @Query('codEmpresa') codEmpresa: number,
    @Query('codParametro') codParametro: number
  ): Promise<ConfigWhats> {
    console.log(codEmpresa, codParametro)
    if (
      codEmpresa === undefined ||
      codParametro === undefined ||
      codEmpresa === null ||
      codParametro === null
    ) {
      throw new BadRequestException(
        'codEmpresa e codParametro são obrigatórios'
      )
    }

    this.logger.log(
      `Recebendo parâmetros: codEmpresa=${codEmpresa}, codParametro=${codParametro}`
    )
    return this.configService.getConfigWhats(codEmpresa, codParametro)
  }
}
