import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from 'src/middlewares/auth.guard'
import { PaymentMethodsService } from './payment_methods.service'

@Controller('paymentMethods')
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  @Get('onePaymentMethodByCode/:cod_forma')
  @UseGuards(AuthGuard)
  getPaymentMethod(@Param('cod_forma') cod_forma: number) {
    return this.paymentMethodsService.getOnePaymentMethod(cod_forma)
  }

  @Get('allPaymentMethods')
  @UseGuards(AuthGuard)
  getAllPaymentMethods() {
    return this.paymentMethodsService.getAllPaymentMethods()
  }

  @Get('meiosPagto')
  @UseGuards(AuthGuard)
  getPaymentMethods(
    @Query('param1') param1: number,
    @Query('param2') param2: number
  ) {
    return this.paymentMethodsService.getPaymentMethods(param1, param2)
  }
}
