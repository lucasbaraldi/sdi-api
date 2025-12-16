import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CompanyService } from './company.service'

import { AuthGuard } from 'src/middlewares/auth.guard'
import { Param } from '@nestjs/common/decorators'

@ApiTags('Company')
@ApiBearerAuth('access-token')
@Controller('company')
export class CompanyController {
  constructor(private readonly CompanyService: CompanyService) {}

  @Get('/empresa/:cod_empresa')
  @UseGuards(AuthGuard)
  empresa(@Param('cod_empresa') cod_empresa: number) {
    return this.CompanyService.empresa(cod_empresa)
  }
  @Get('/empresas')
  empresas() {
    return this.CompanyService.empresas()
  }
}
