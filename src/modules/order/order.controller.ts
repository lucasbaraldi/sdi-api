import {
  Controller,
  Post,
  Body,
  HttpCode,
  Get,
  Query,
  Patch,
  Param,
  NotFoundException
} from '@nestjs/common'
import { OrderService } from './order.service'
import { CreateOrderDto } from './dto/create-order.dto'
import { Order } from './entities/order.entity'
import { OrderReleaseService } from './order-release.service'
import { CreateReleaseOrderDto } from './dto/create-release-order.dto'
import { UpdateReleaseStatusDto } from './dto/update-release-status.dto'

@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly orderReleaseService: OrderReleaseService
  ) {}

  @Post('create-order')
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

  @Post('create-release')
  @HttpCode(201)
  async createRelease(@Body() createReleaseOrderDto: CreateReleaseOrderDto) {
    return await this.orderReleaseService.createRelease(createReleaseOrderDto)
  }

  @Patch('update-release')
  @HttpCode(200)
  async updateReleaseStatus(
    @Body() updateReleaseStatusDto: UpdateReleaseStatusDto
  ) {
    return await this.orderReleaseService.updateReleaseStatus(
      updateReleaseStatusDto
    )
  }

  @Get('check-released-status')
  async checkReleasedStatus(@Query('requestId') requestId: string) {
    return await this.orderReleaseService.checkReleasedStatus(requestId)
  }

  @Get('check-order-details')
  async checkOrderDetails(
    @Query('nro_controle') nroControle: number,
    @Query('id_cliente') idCliente: number,
    @Query('vlr_total') vlrTotal: number,
    @Query('vlr_prod') vlrProd: number
  ) {
    const { order } = await this.orderService.checkOrderByDetails(
      nroControle,
      idCliente,
      vlrTotal,
      vlrProd
    )

    if (!order) {
      throw new NotFoundException(
        'Nenhuma ordem encontrada com os detalhes fornecidos.'
      )
    }

    return {
      order
    }
  }
}
