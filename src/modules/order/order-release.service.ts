import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { FirebirdClient } from 'src/firebird/firebird.client'
import { CreateReleaseOrderDto } from './dto/create-release-order.dto'
import { UpdateReleaseStatusDto } from './dto/update-release-status.dto'

@Injectable()
export class OrderReleaseService {
  constructor(private readonly firebirdClient: FirebirdClient) {}

  // Função para inserir um novo registro na tabela
  async createRelease(order: CreateReleaseOrderDto): Promise<any> {
    const existingRelease = await this.checkExistingRelease(order.requestId)
    if (existingRelease) {
      throw new BadRequestException(
        `Release request with COD_SOLICITACAO ${order.requestId} already exists.`
      )
    }

    const query = `
      INSERT INTO ONLINE_PEDIDO_LIBERA_VENDA (COD_VENDEDOR, COD_PRODUTO, COD_SOLICITACAO, LIBERADO, DATA_CRIACAO, PRECO_ORIGINAL, PRECO_PRATICADO)
      VALUES (?, ?, ?, 'N', ?, ?, ?)
    `
    const params = [
      order.salesRepId,
      order.productId,
      order.requestId,
      order.creationDate,
      order.originalPrice,
      order.salePrice
    ]
    await this.firebirdClient.runQuery({ query, params })
    return { message: 'Release request created successfully' }
  }

  async updateReleaseStatus(dto: UpdateReleaseStatusDto): Promise<any> {
    if (dto.released !== 'S' && dto.released !== 'N') {
      throw new BadRequestException('Invalid value for released status')
    }

    const firebirdTimestamp = new Date(dto.releaseDate)
      .toISOString()
      .replace('T', ' ')
      .slice(0, 19)

    const result = await new Promise((resolve, reject) => {
      return this.firebirdClient.runQuery({
        query: `
          UPDATE ONLINE_PEDIDO_LIBERA_VENDA
          SET LIBERADO = '${dto.released}', DATA_LIBERACAO = '${firebirdTimestamp}'
          WHERE COD_SOLICITACAO = '${dto.requestId}'
        `,
        params: [],
        buffer: (result: any, err: any) => {
          if (err) {
            reject(
              new NotFoundException(`Error executing update: ${err.message}`)
            )
          } else {
            console.log('Status da liberação atualizado com sucesso')
            resolve(true)
          }
        }
      })
    })

    if (result == true) {
      return new Promise((resolve, reject) => {
        this.firebirdClient.runQuery({
          query: `
          select * from ONLINE_PEDIDO_LIBERA_VENDA 
            where COD_SOLICITACAO = '${dto.requestId}'
          `,
          params: [],
          buffer: (result: any, err: any) => {
            if (err) {
              reject(err)
            } else {
              result.forEach(r => {
                r.LIBERADO = r.LIBERADO.trim()
              })
              resolve(result[0])
            }
          }
        })
      })
    } else {
      return {
        message: `Não foi possivel atualizar o status da liberação`
      }
    }
  }

  // Função para consultar o status de liberação pelo COD_SOLICITACAO
  async checkReleasedStatus(requestId: string): Promise<{ liberado: any }> {
    const query = `
      SELECT LIBERADO
      FROM ONLINE_PEDIDO_LIBERA_VENDA
      WHERE COD_SOLICITACAO = ?
    `
    const result: any = await this.firebirdClient.runQuery({
      query,
      params: [requestId]
    })
    if (result.length === 0) {
      throw new NotFoundException(
        `Release request with COD_SOLICITACAO ${requestId} not found.`
      )
    }
    return { liberado: result[0].LIBERADO.trim() }
  }

  // Função para verificar se já existe uma liberação com o mesmo COD_SOLICITACAO
  private async checkExistingRelease(requestId: string): Promise<any> {
    const result: any = await this.firebirdClient.runQuery({
      query: `
        SELECT 1 FROM ONLINE_PEDIDO_LIBERA_VENDA
        WHERE COD_SOLICITACAO = ?
      `,
      params: [requestId]
    })
    if (result.length > 0) {
      throw new BadRequestException(
        `Release request with COD_SOLICITACAO ${requestId} already exists.`
      )
    }
    return result
  }
}
