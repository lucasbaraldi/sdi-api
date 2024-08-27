// config.service.ts
import { Injectable, NotFoundException } from '@nestjs/common'
import { FirebirdClient } from 'src/firebird/firebird.client'
import { ConfigWhats } from './entities/config-whats.entity'
import { ConfigWhatsMapper } from './mappers/config-whats.mapper'

@Injectable()
export class ConfigService {
  constructor(private readonly firebirdClient: FirebirdClient) {}

  async getConfigWhats(
    codEmpresa: number,
    codParametro: number
  ): Promise<ConfigWhats> {
    const empresa: any = await this.firebirdClient.runQuery({
      query: `
          SELECT * FROM EMPRESAS 
          WHERE COD_EMPRESA = ?
        `,
      params: [codEmpresa]
    })

    if (!empresa) {
      throw new NotFoundException('Empresa não encontrada')
    }

    const parametro: any = await this.firebirdClient.runQuery({
      query: `
          SELECT * FROM CONFIG_SIS 
          WHERE COD_CONFIG = ?
        `,
      params: [codParametro]
    })

    if (!parametro) {
      throw new NotFoundException('Parâmetro não encontrado')
    }

    const configWhats: any = await this.firebirdClient.runQuery({
      query: `
          SELECT * FROM CONFIG_WHATS 
          WHERE COD_EMPRESA = ? AND COD_PARAMETRO = ?
        `,
      params: [codEmpresa, codParametro]
    })

    if (!configWhats) {
      throw new NotFoundException('Configuração não encontrada')
    }

    // Aplicar trim e mapear os campos
    return ConfigWhatsMapper.toEntity(configWhats[0])
  }
}
