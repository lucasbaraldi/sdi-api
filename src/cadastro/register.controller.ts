import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { RegisterService } from './register.service'

import { AuthGuard } from 'src/middlewares/auth.guard'

@Controller()
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Get('/empresas')
  empresas() {
    return this.registerService.empresas()
  }

  @Get('/empresa/:cod_empresa')
  @UseGuards(AuthGuard)
  empresa(@Param('cod_empresa') cod_empresa: number) {
    return this.registerService.empresa(cod_empresa)
  }
}
