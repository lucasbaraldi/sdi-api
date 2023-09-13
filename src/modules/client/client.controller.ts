import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { ClientService } from './client.service'

import { AuthGuard } from 'src/middlewares/auth.guard'

@Controller('client')
export class ClientController {
  constructor(private readonly ClientService: ClientService) {}

  @Get('/allClients/:cod_empresa')
  @UseGuards(AuthGuard)
  allClients(@Param('cod_empresa') cod_empresa: number) {
    return this.ClientService.getAllClients(cod_empresa)
  }
  @Get('/oneClient/:cod_empresa/:cod_cliente')
  @UseGuards(AuthGuard)
  getOneClient(
    @Param('cod_empresa') cod_empresa: number,
    @Param('cod_cliente') cod_cliente: number
  ) {
    return this.ClientService.getOneClient(cod_empresa, cod_cliente)
  }
}
