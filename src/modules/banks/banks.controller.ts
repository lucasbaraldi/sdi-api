import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { AuthGuard } from 'src/middlewares/auth.guard'
import { BanksService } from './banks.service'

@Controller('banks')
export class BanksController {
  constructor(private readonly banksService: BanksService) {}

  @Get('oneBankByCode/:cod_banco')
  @UseGuards(AuthGuard)
  getBank(@Param('cod_banco') cod_banco: number) {
    return this.banksService.getOneBank(cod_banco)
  }

  @Get('allBanks')
  @UseGuards(AuthGuard)
  getAllBanks() {
    return this.banksService.getAllBanks()
  }
}
