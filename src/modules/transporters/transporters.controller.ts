import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { AuthGuard } from 'src/middlewares/auth.guard'
import { TransportersService } from './transporters.service'

@Controller('transporters')
export class TransportersController {
  constructor(private readonly transportersService: TransportersService) {}

  @Get('oneTransporterByCode/:cod_transp')
  @UseGuards(AuthGuard)
  getTransporter(@Param('cod_transp') cod_transp: number) {
    return this.transportersService.getOneTransporter(cod_transp)
  }

  @Get('allTransporters')
  @UseGuards(AuthGuard)
  getAllTransporters() {
    return this.transportersService.getAllTransporters()
  }
}
