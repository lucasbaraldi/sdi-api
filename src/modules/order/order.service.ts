import { ConflictException, Injectable } from '@nestjs/common'
import { FirebirdClient } from 'src/firebird/firebird.client'
import { CreateOrderDto } from './dto/create-order.dto'
import { Order } from './entities/order.entity'
import { OrderItem } from './entities/order-item.entity'
import { saveLog } from 'src/commons'

@Injectable()
export class OrderService {
  constructor(private readonly firebirdClient: FirebirdClient) {}

  async createOrder(body: CreateOrderDto): Promise<any> {
    console.log('createOrder', body)
    const {
      cod_empresa,
      id_cliente,
      dt_emissao,
      cod_transp,
      cod_mepg,
      cod_banco,
      cod_forma_pgto,
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
      cod_empresa,
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
        COD_EMPRESA, ID_CLIENTE, DT_EMISSAO, COD_TRANSP, COD_BANCO, 
        COD_FORMA_PGTO, VLR_FRETE, VLR_TOTAL, VLR_PROD, 
        TIPO_FRETE, OBS, STATUS, 
        COD_VENDEDOR, NRO_CONTROLE, COD_MEPG
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      ) RETURNING ID
    `,
      params: [
        cod_empresa,
        id_cliente,
        dt_emissao,
        cod_transp || null,
        cod_banco || null,
        cod_forma_pgto,
        vlr_frete || 0,
        vlr_total,
        vlr_prod,
        tipo_frete || 'S',
        obs || '',
        'N',
        cod_vendedor,
        nro_controle,
        cod_mepg
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
            item.id_produto,
            item.id_seqitem,
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

    //* Formatar o log com corpo do pedido e itens
    const logData = `
  Pedido ID: ${pedidoId}
  ----------------------
  Empresa: ${cod_empresa}
  Cliente: ${id_cliente}
  Data Emissão: ${dt_emissao}
  Transporte: ${cod_transp || 'N/A'}
  Banco: ${cod_banco || 'N/A'}
  Forma de Pagamento: ${cod_forma_pgto}
  Frete: ${vlr_frete || 0}
  Total: ${vlr_total}
  Produtos: ${vlr_prod}
  Tipo de Frete: ${tipo_frete || 'S'}
  Observações: ${obs || 'Nenhuma'}
  Vendedor: ${cod_vendedor}
  Controle Nº: ${nro_controle}
  ----------------------
  Itens:
  ${itens
    .map(
      (item: any, index: number) => `
  Item ${index + 1}:
    Produto ID: ${item.id_produto}
    Sequência: ${item.id_seqitem}
    Quantidade: ${item.quantidade}
    Valor Unitário: ${item.vlr_unitario || 0}
    Valor Total: ${item.vlr_total}
    Descrição: ${item.descr_prod || ''}
    Tabela de Preço: ${item.cod_tabpreco || 'N/A'}
    Desconto: ${item.perc_descto || 0}%
    Quantidade 2: ${item.quantidade2 || 0}
    Unidade 2: ${item.unid2 || 0}
  `
    )
    .join('\n')}
  ----------------------
  `

    await saveLog(`pedido_${pedidoId}.txt`, logData)

    console.log(`Pedido ${pedidoId} adicionado com sucesso`)
    return { message: `Pedido ${pedidoId} adicionado com sucesso` }
  }

  private async checkExistingOrder(
    cod_empresa: number,
    cod_vendedor: number,
    nro_controle: number
  ): Promise<boolean> {
    const result: any = await this.firebirdClient.runQuery({
      query: `
        SELECT 1 FROM ONLINE_PEDIDO 
        WHERE COD_EMPRESA = ? AND COD_VENDEDOR = ? AND NRO_CONTROLE = ?
      `,
      params: [cod_empresa, cod_vendedor, nro_controle]
    })

    return result.length > 0
  }

  async getOrders(
    codEmpresa: number,
    codVendedor: number,
    dataEmissao: string
  ): Promise<Order[]> {
    const query = `
      SELECT *
      FROM ONLINE_PEDIDO
      WHERE COD_EMPRESA = ? AND COD_VENDEDOR = ? AND DT_EMISSAO >= ?
    `
    const params = [codEmpresa, codVendedor, dataEmissao]

    const result: any = await this.firebirdClient.runQuery({
      query,
      params
    })
    const cleanTipoFrete = (tipoFrete: string | null): string | null => {
      return tipoFrete ? tipoFrete.trim() : null
    }
    const orders: Order[] = result.map((record: any) => ({
      id: record.ID,
      cod_empresa: record.COD_EMPRESA,
      dt_emissao: new Date(record.DT_EMISSAO),
      id_cliente: record.ID_CLIENTE,
      cod_transp: record.COD_TRANSP,
      cod_forma_pgto: record.COD_FORMA_PGTO,
      cod_banco: record.COD_BANCO,
      vlr_frete: record.VLR_FRETE,
      vlr_total: record.VLR_TOTAL,
      vlr_prod: record.VLR_PROD,
      tipo_frete: cleanTipoFrete(record.TIPO_FRETE),
      obs: record.OBS,
      status: record.STATUS,
      cod_vendedor: record.COD_VENDEDOR,
      nro_controle: record.NRO_CONTROLE,
      itens: []
    }))

    for (const order of orders) {
      order.itens = await this.getOrderItems(order.id)
    }

    return orders
  }

  private async getOrderItems(orderId: number): Promise<OrderItem[]> {
    const query = `SELECT 
        ID_PEDIDO, 
        ID_PRODUTO, 
        ID_SEQITEM, 
        QUANTIDADE, 
        VLR_UNITARIO, 
        VLR_TOTAL, 
        DESCR_PROD, 
        COD_TABPRECO, 
        PERC_DESCTO, 
        QUANTIDADE2, 
        UNID2
      FROM ONLINE_PEDIDOITEM
      WHERE ID_PEDIDO = ?`

    const params = [orderId]

    const result: any = await this.firebirdClient.runQuery({
      query,
      params
    })

    const orderItems: OrderItem[] = result.map((record: any) => ({
      id_pedido: record.ID_PEDIDO,
      id_produto: record.ID_PRODUTO,
      id_seqitem: record.ID_SEQITEM,
      quantidade: record.QUANTIDADE,
      vlr_unitario: record.VLR_UNITARIO,
      vlr_total: record.VLR_TOTAL,
      descr_prod: record.DESCR_PROD,
      cod_tabpreco: record.COD_TABPRECO,
      perc_descto: record.PERC_DESCTO,
      quantidade2: record.QUANTIDADE2,
      unid2: record.UNID2
    }))

    return orderItems
  }

  async checkOrderByDetails(
    nro_controle: number,
    id_cliente: number,
    vlr_total: number,
    vlr_prod: number
  ): Promise<{ order: Order | null }> {
    const query = `
      SELECT *
      FROM ONLINE_PEDIDO
      WHERE NRO_CONTROLE = ? AND ID_CLIENTE = ? AND VLR_TOTAL = ? AND VLR_PROD = ?
    `
    const params = [nro_controle, id_cliente, vlr_total, vlr_prod]

    const result = (await this.firebirdClient.runQuery({
      query,
      params
    })) as any[]

    const record = result[0]
    if (!record) {
      return { order: null }
    }

    const order: Order = {
      id: record.ID,
      cod_empresa: record.COD_EMPRESA,
      dtEmissao: new Date(record.DT_EMISSAO),
      idCliente: record.ID_CLIENTE,
      codTransp: record.COD_TRANSP,
      codFormaPgto: record.COD_FORMA_PGTO,
      codBanco: record.COD_BANCO,
      vlrFrete: record.VLR_FRETE,
      vlrTotal: record.VLR_TOTAL,
      vlrProd: record.VLR_PROD,
      tipoFrete: record.TIPO_FRETE ? record.TIPO_FRETE.trim() : null,
      obs: record.OBS,
      status: record.STATUS,
      codVendedor: record.COD_VENDEDOR,
      nroControle: record.NRO_CONTROLE
    }

    return {
      order
    }
  }
}
