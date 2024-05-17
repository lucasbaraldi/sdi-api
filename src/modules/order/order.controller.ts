import { Controller, Post, Body, HttpCode } from '@nestjs/common'
import { OrderService } from './order.service'
import { CreateOrderDto } from './dto/create-order.dto'

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create-order')
  @HttpCode(201)
  async createOrder(@Body() createOrderInput: CreateOrderDto) {
    return await this.orderService.createOrder(createOrderInput)
  }
}
