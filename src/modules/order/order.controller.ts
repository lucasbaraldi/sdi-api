import {
  Controller,
  Post,
  Body,
  HttpCode,
  ValidationPipe,
  UsePipes,
  Get,
  Query
} from '@nestjs/common'
import { OrderService } from './order.service'
import { CreateOrderDto } from './dto/create-order.dto'
import { Order } from './entities/order.entity'

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create-order')
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(201)
  async createOrder(@Body() createOrderInput: CreateOrderDto) {
    return await this.orderService.createOrder(createOrderInput)
  }

  @Get()
  async getOrders(
    @Query('cod_empresa') codEmpresa: number,
    @Query('cod_vendedor') codVendedor: number,
    @Query('data_emissao') dataEmissao: string
  ): Promise<Order[]> {
    const orders = await this.orderService.getOrders(
      codEmpresa,
      codVendedor,
      dataEmissao
    )
    return orders
  }
}
