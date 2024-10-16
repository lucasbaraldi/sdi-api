import { Controller, Get, Post, Body, Param, UseGuards, ConflictException, HttpStatus } from '@nestjs/common'
import { ClientService } from './client.service'
import { AuthGuard } from 'src/middlewares/auth.guard'

import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger'
import { QuickCreateClientDto } from './dto/quick-create-cliente.dto'

@ApiTags('clients')
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get('/allClients/:cod_empresa')
  @UseGuards(AuthGuard)
  allClients(@Param('cod_empresa') cod_empresa: number) {
    return this.clientService.getAllClients(cod_empresa)
  }

  @Get('/oneClient/:cod_empresa/:cod_cliente')
  @UseGuards(AuthGuard)
  getOneClient(
    @Param('cod_empresa') cod_empresa: number,
    @Param('cod_cliente') cod_cliente: number
  ) {
    return this.clientService.getOneClient(cod_empresa, cod_cliente)
  }

  @Post('/quickCreate')
  @ApiOperation({ summary: 'Criar cliente rapidamente ou retornar cliente existente' })
  @ApiBody({ type: QuickCreateClientDto })
  @ApiResponse({ status: 201, description: 'Cliente criado com sucesso.' })
  @ApiResponse({ status: 409, description: 'Cliente existente encontrado.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  async quickCreateClient(@Body() clientData: QuickCreateClientDto) {
    // Primeiro, verifica se o cliente já existe
    const existingClient = await this.clientService.findClientByName(clientData.name);
    
    if (existingClient) {
      // Se o cliente existir, retorna o cliente existente com status 409 (Conflict)
      throw new ConflictException({
        status: 'existing',
        client: existingClient
      });
    }

    // Se o cliente não existir, cria um novo
    const newClient = await this.clientService.quickCreateClient(clientData.name, clientData.cellphone);
    return {
      status: 'created',
      client: newClient
    };
  }
}
