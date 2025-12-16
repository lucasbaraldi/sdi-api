import { Injectable, Logger } from '@nestjs/common'
import { buscaParametro } from 'src/commons'

import { FirebirdClient } from 'src/firebird/firebird.client'
import { CreateComandaDto } from './dto/create-comanda.dto'

@Injectable()
export class ComandaService {
  private readonly logger = new Logger(ComandaService.name)

  constructor(private readonly firebirdClient: FirebirdClient) {}

  itensComanda(nro_controle: any): any {
    console.log('Cliente da comanda ' + nro_controle + ' enviados com sucesso!')

    return this.firebirdClient.runQuery({
      query: `
      SELECT BR.NRO_CONTROLE, IR.*
      FROM ITENS_ROMANEIOS IR INNER JOIN
         ROMANEIOS R ON ( IR.COD_EMPRESA = R.COD_EMPRESA AND
               IR.TIPO_CONTROL = R.TIPO_CONTROL AND
               IR.NRO_ROMANEIO = R.NRO_ROMANEIO) INNER JOIN
          BAR_ROMANEIO BR ON ( IR.COD_EMPRESA = BR.COD_EMPRESA AND
               IR.TIPO_CONTROL = BR.TIPO_CONTROL AND
               IR.NRO_ROMANEIO = BR.NRO_ROMANEIO)
      WHERE BR.NRO_CONTROLE = ${nro_controle}
      AND R.SITUACAO = 'A'
      ORDER BY SEQ_ITEM
      `,
      params: []
    })
  }

  clienteComanda(nro_controle: any): any {
    console.log('Cliente da comanda ' + nro_controle + ' enviados com sucesso!')

    return this.firebirdClient.runQuery({
      query: `
        SELECT R.NOME_CLIENTE, R.COD_CLIENTE, BR.NRO_CONTROLE
          FROM ROMANEIOS R
          INNER JOIN BAR_ROMANEIO BR ON (
            R.COD_EMPRESA = BR.COD_EMPRESA AND
            R.TIPO_CONTROL = BR.TIPO_CONTROL AND
            R.NRO_ROMANEIO = BR.NRO_ROMANEIO
          )
          WHERE BR.NRO_CONTROLE = ${nro_controle}
            AND R.SITUACAO = 'A'
      `,
      params: []
    })
  }
  async clientes(cod_empresa: number): Promise<any> {
    const separaClientes = await new Promise((res, _rej) => {
      buscaParametro(
        this.firebirdClient,
        'GER_SEPARAR_PESSOAS_EMPRESA',
        result => res(result)
      )
    })

    if (separaClientes == 'N') {
      return this.firebirdClient.runQuery({
        query: `
        SELECT
        COD_CLIENTE,
        NOME,
        (CASE WHEN CELULAR IS NOT NULL AND CELULAR > ' ' THEN CELULAR ELSE 'SEM CELULAR' END) AS CELULAR,
        (CASE WHEN FONE  IS NOT NULL AND FONE > ' ' THEN FONE
        WHEN FAX IS NOT NULL AND FAX > ' ' THEN FAX
        ELSE 'SEM TELEFONE' END) AS FONE
        FROM CLIENTES WHERE TIPO_CLI = 'A'
      `,
        params: []
      })
    } else {
      return this.firebirdClient.runQuery({
        query: `
        SELECT
        COD_CLIENTE,
        NOME,
        (CASE WHEN CELULAR IS NOT NULL AND CELULAR > ' ' THEN CELULAR ELSE 'SEM CELULAR' END) AS CELULAR,
        (CASE WHEN FONE  IS NOT NULL AND FONE > ' ' THEN FONE
        WHEN FAX IS NOT NULL AND FAX > ' ' THEN FAX
        ELSE 'SEM TELEFONE' END) AS FONE
        FROM CLIENTES WHERE TIPO_CLI = 'A' AND COD_EMPRESA = ${cod_empresa}

      `,
        params: []
      })
    }
  }
  getComandas(nro_controle: any): any {
    return this.firebirdClient.runQuery({
      query: `
      SELECT RM.*,
            BRM.NRO_CONTROLE,
            BRM.TIPO_ORIGEM,
            BRM.VLR_DELIVERY,
            BRM.PELO_SITE,
            CL.NOME AS NOME_DO_CLIENTE
        FROM ROMANEIOS RM
        INNER JOIN BAR_ROMANEIO BRM ON (RM.COD_EMPRESA = BRM.COD_EMPRESA
                AND RM.TIPO_CONTROL = BRM.TIPO_CONTROL
                AND RM.NRO_ROMANEIO = BRM.NRO_ROMANEIO)
        INNER JOIN CLIENTES CL ON (RM.COD_CLIENTE = CL.COD_CLIENTE)
        WHERE RM.COD_EMPRESA = 1 AND
         RM.SITUACAO = 'A' AND
         RM.TIPO_CONTROL = 'Q' AND
         BRM.NRO_CONTROLE = ${nro_controle}
      `,
      params: []
    })
  }

  cardapio(): any {
    return this.firebirdClient.runQuery({
      query: `
      SELECT * from BAR_CARDAPIO
      `,
      params: []
    })
  }
  finalizacao(): any {
    return this.firebirdClient.runQuery({
      query: `
      SELECT * from BAR_FINALIZACAO
      `,
      params: []
    })
  }
  barSegmentos(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.firebirdClient.runQuery({
        query: `
        SELECT * from BAR_SEGMENTO`,
        params: [],
        buffer: (result: any, err: any) => {
          if (err) {
            reject(err)
          } else {
            result.forEach(r => {
              r.TIPO = r.TIPO.trim()
            })
            resolve(result)
          }
        }
      })
    })
  }
  barGrupos(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.firebirdClient.runQuery({
        query: `
        SELECT TB1.TIPO,
          TB1.COD_SECAO,
          TB1.COD_GRUPO,
          MAX(TB1.DESCRICAO)  AS DESCR_GRUPO
        FROM
        (
          SELECT BSG.TIPO,
            PD.COD_SECAO,
            PD.COD_GRUPO,
            GP.DESCRICAO
          FROM PRODUTOS PD
          INNER JOIN BAR_PRODUTOS BPD ON (PD.COD_PRODUTO = BPD.COD_PRODUTO)
          INNER JOIN BAR_SEGMENTO BSG ON (BPD.COD_SEGMENTO = BSG.COD_SEGMENTO)
          INNER JOIN GRUPOS_PRODUTOS GP ON (PD.COD_SECAO = GP.COD_SECAO
                   AND PD.COD_GRUPO = GP.COD_GRUPO)
          WHERE PD.TIPO_PROD = 'A'
            AND (BPD.TIPO_ORIGEM = 'A' OR BPD.TIPO_ORIGEM = 'L' )

          UNION

          SELECT BSG.TIPO,
            99 AS COD_SECAO,
            SV.COD_GRUPO,
            GP.DESCRICAO
          FROM SERVICOS SV
          INNER JOIN BAR_SEGMENTO BSG ON (SV.BAR_COD_SEGMENTO = BSG.COD_SEGMENTO)
          INNER JOIN GRUPOS_SERVICOS GP ON (SV.COD_GRUPO = GP.COD_GRUPO)
          WHERE SV.TIPO_SERV = 'A'
        ) TB1
        GROUP BY TB1.TIPO, TB1.COD_SECAO, TB1.COD_GRUPO
        `,
        params: [],
        buffer: (result: any, err: any) => {
          if (err) {
            reject(err)
          } else {
            result.forEach(r => {
              r.TIPO = r.TIPO.trim()
            })
            console.log('Grupos Atualizados com sucesso')
            resolve(result)
          }
        }
      })
    })
  }

  async comandas(createComandaDto: CreateComandaDto) {
    const obsDescricao = await this.buscaParametro(
      'BAR_PEDIDO_ITEM_OBS_NA_DESCRICAO'
    )
    const codigoConsumidorFinal = await this.buscaParametro('CONSUMIDORFINAL')

    this.logger.log(`obsDescricao: ${obsDescricao}`)
    this.logger.log(`codigoConsumidorFinal: ${codigoConsumidorFinal}`)

    const {
      dt_emissao,
      id_cliente,
      cod_transp,
      cod_forma_pgto,
      cod_banco,
      vlr_frete,
      vlr_total,
      vlr_prod,
      tipo_frete,
      obs,
      email,
      cod_vendedor,
      nro_controle,
      nro_dispositivo,
      hr_emissao,
      itens
    } = createComandaDto

    const cliente = id_cliente ?? codigoConsumidorFinal

    this.logger.log(`Nro_controle: ${nro_controle}`)
    this.logger.log(`Codigo Cliente app: ${id_cliente}`)
    this.logger.log(`Codigo Consumidor Final: ${codigoConsumidorFinal}`)
    this.logger.log(`nro_dispositivo: ${nro_dispositivo}`)
    this.logger.log(`dt_emissão: ${dt_emissao}`)

    const result: any = await this.firebirdClient.runQuery({
      query: `INSERT INTO ONLINE_PEDIDO (
       COD_EMPRESA, DT_EMISSAO, ID_CLIENTE, COD_TRANSP, COD_FORMA_PGTO,
       COD_BANCO, VLR_FRETE, VLR_TOTAL, VLR_PROD, TIPO_FRETE, OBS, STATUS,
       EMAIL, COD_VENDEDOR, NRO_CONTROLE, NRO_TABLET, HR_EMISSAO )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING ID `,
      params: [
        1,
        dt_emissao,
        cliente,
        cod_transp,
        cod_forma_pgto,
        cod_banco,
        vlr_frete,
        vlr_total,
        vlr_prod,
        tipo_frete,
        obs,
        'I',
        email,
        cod_vendedor,
        nro_controle,
        nro_dispositivo,
        hr_emissao
      ]
    })

    const pedidoId = result.ID

    await Promise.all(
      itens.map(async (item, idx) => {
        const observacaoItem = this.formatarObservacaoItem(obsDescricao, item)

        await this.firebirdClient.runQuery({
          query: `INSERT INTO ONLINE_PEDIDOITEM (
            ID_PEDIDO, ID_PRODUTO, ID_SEQITEM, QUANTIDADE, VLR_UNITARIO, VLR_TOTAL,
             DESCR_PROD, COD_TABPRECO, PERC_DESCTO, DESCR_COMPLTO, CARDAPIO, NRO_CARDAPIO,
             FINALIZACAO, NRO_MESA, OBS_SABORES, QUANTIDADE2, UNID2, TIPO_ITEM )
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          params: [
            pedidoId,
            item.id_produto,
            idx + 1,
            item.quantidade,
            item.vlr_unitario,
            item.vlr_total,
            item.descr_prod,
            item.cod_tabpreco,
            item.perc_descto,
            observacaoItem.observacaoItem,
            item.cardapio,
            item.nro_cardapio,
            item.finalizacao,
            item.nro_mesa,
            observacaoItem.observacaoGeral,
            item.quantidade2,
            item.unid2,
            item.tipo_item
          ]
        })
      })
    )

    this.logger.log(`Comanda ${pedidoId} adicionada com sucesso`)
    return {
      message: `Comanda ${pedidoId} adicionada com sucesso`,
      id: pedidoId
    }
  }

  private async buscaParametro(parametro: string): Promise<any> {
    return new Promise(resolve => {
      buscaParametro(this.firebirdClient, parametro, result => resolve(result))
    })
  }

  private formatarObservacaoItem(obsDescricao: string, item: any) {
    let observacaoGeral, observacaoItem

    if (obsDescricao === 'N') {
      observacaoGeral = item.obs_sabores
      observacaoItem = item.descr_prod
    } else {
      observacaoGeral = null
      observacaoItem = item.obs_sabores
        ? `${item.descr_prod} (${item.obs_sabores})`
        : item.descr_prod
    }

    return { observacaoGeral, observacaoItem }
  }

  produtos(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.firebirdClient.runQuery({
        query: `
        SELECT 'P' AS TIPO_ITEM,
          PD.COD_PRODUTO AS COD_ITEM,
          PD.COD_BARRAS,
          PD.DESCRICAO,
          CAST(PD.PRECO_VENDA AS DOUBLE PRECISION) AS PRECO_VENDA,
          PD.COD_SECAO,
          PD.COD_GRUPO,
          PDB.COD_SEGMENTO,
          PDB.QTD_SABORES,
          SGB.TIPO AS TIPO_SEGMENTO
        FROM PRODUTOS PD
        INNER JOIN BAR_PRODUTOS PDB ON (PD.COD_PRODUTO = PDB.COD_PRODUTO)
        INNER JOIN BAR_SEGMENTO SGB ON (PDB.COD_SEGMENTO = SGB.COD_SEGMENTO)
        WHERE PD.TIPO_PROD = 'A'
        AND (PDB.TIPO_ORIGEM = 'A' OR PDB.TIPO_ORIGEM = 'L')

        UNION

        SELECT 'S' AS TIPO_ITEM,
          SV.COD_SERVICO AS COD_ITEM,
          0 AS COD_BARRAS,
          SV.BAR_DESCR_SERV AS DESCRICAO,
          SV.VALOR AS PRECO_VENDA,
          99 AS COD_SECAO,
          SV.COD_GRUPO,
          SV.BAR_COD_SEGMENTO AS COD_SEGMENTO,
          0 AS QTD_SABORES,
          SGB.TIPO AS TIPO_SEGMENTO
        FROM SERVICOS SV
        INNER JOIN BAR_SEGMENTO SGB ON (SV.BAR_COD_SEGMENTO = SGB.COD_SEGMENTO)
        WHERE SV.TIPO_SERV = 'A'`,
        params: [],
        buffer: (result: any, err: any) => {
          if (err) {
            reject(err)
          } else {
            result.forEach((r: any) => {
              r.PRECO_VENDA = parseFloat(r.PRECO_VENDA).toFixed(2)
              r.TIPO_ITEM = r.TIPO_ITEM.trim()
              r.TIPO_SEGMENTO = r.TIPO_SEGMENTO.trim()
            })
            resolve(result)
          }
        }
      })
    })
  }
}
