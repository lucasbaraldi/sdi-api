import { ConflictException, Injectable } from '@nestjs/common'
import { FirebirdClient } from 'src/firebird/firebird.client'
import { buscaParametro } from 'src/commons'
import { CreateOrderDto } from './dto/create-order.dto'

@Injectable()
export class OrderService {
  constructor(private readonly firebirdClient: FirebirdClient) {}

  async createOrder(body: CreateOrderDto): Promise<any> {
    const {
      id_cliente,
      dt_emissao,
      cod_transp,
      cod_banco,
      vlr_frete,
      vlr_total,
      vlr_prod,
      tipo_frete,
      obs,
      cod_vendedor,
      nro_controle,
      itens
    } = body

    // Verificar se o pedido já existe
    const existingOrder = await this.checkExistingOrder(
      cod_vendedor,
      nro_controle
    )
    if (existingOrder) {
      throw new ConflictException(
        `Pedido nro ${nro_controle} já existe na base de dados para o vendedor ${cod_vendedor}`
      )
    }

    // Inserir pedido
    const result: any = await this.firebirdClient.runQuery({
      query: `
        INSERT INTO ONLINE_PEDIDO (
          ID_CLIENTE, DT_EMISSAO, COD_TRANSP, COD_BANCO, 
          VLR_FRETE, VLR_TOTAL, VLR_PROD, 
          TIPO_FRETE, OBS, STATUS, 
          COD_VENDEDOR, NRO_CONTROLE
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        ) RETURNING ID
      `,
      params: [
        id_cliente,
        dt_emissao,
        cod_transp || null,
        cod_banco || null,
        vlr_frete || 0,
        vlr_total,
        vlr_prod,
        tipo_frete || 'S', // Default value for tipo_frete
        obs || '',
        'N',
        cod_vendedor,
        nro_controle
      ]
    })

    const pedidoId = result.ID
    console.log('PEDIDO_ID', pedidoId)

    await Promise.all(
      itens.map(async (item: any) => {
        await this.firebirdClient.runQuery({
          query: `
          INSERT INTO ONLINE_PEDIDOITEM (
            ID_PEDIDO, ID, ID_PRODUTO, ID_SEQITEM, QUANTIDADE, 
            VLR_UNITARIO, VLR_TOTAL, DESCR_PROD, 
            COD_TABPRECO, PERC_DESCTO, QUANTIDADE2, UNID2
          ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
          )
          `,
          params: [
            pedidoId,
            pedidoId,
            item.id_seqitem,
            item.id_produto,
            item.quantidade,
            item.vlr_unitario || 0,
            item.vlr_total,
            item.descr_prod || '',
            item.cod_tabpreco || null,
            item.perc_descto || 0,
            item.quantidade2 || 0,
            item.unid2 || 0
          ]
        })
      })
    )

    console.log(`Pedido ${pedidoId} adicionado com sucesso`)
    return { message: `Pedido ${pedidoId} adicionado com sucesso` }
  }

  private async checkExistingOrder(
    cod_vendedor: number,
    nro_controle: number
  ): Promise<boolean> {
    const result: any = await this.firebirdClient.runQuery({
      query: `
        SELECT 1 FROM ONLINE_PEDIDO 
        WHERE COD_VENDEDOR = ? AND NRO_CONTROLE = ?
      `,
      params: [cod_vendedor, nro_controle]
    })

    return result.length > 0
  }
}
