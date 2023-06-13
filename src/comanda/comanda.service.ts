import { Injectable } from '@nestjs/common'
import { buscaParametro } from 'src/commons'

import { FirebirdClient } from 'src/firebird/firebird.client'

@Injectable()
export class ComandaService {
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
      WHERE BR.NRO_CONTROLE = 
      nro_controle 
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

  async comandas(body: any) {
    var cliente
    let obsDescricao = await new Promise((res, rej) => {
      buscaParametro(
        this.firebirdClient,
        'BAR_PEDIDO_ITEM_OBS_NA_DESCRICAO',
        result => res(result)
      )
    })
    console.log('obsDescricao: ', obsDescricao)

    let codigoConsumidorFinal = await new Promise((res, rej) => {
      buscaParametro(this.firebirdClient, 'CONSUMIDORFINAL', result => {
        res(result)
      })
    })
    console.log('codigoConsumidorFinal: ', codigoConsumidorFinal)

    var observacaoGeral, observacaoItem

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
      status,
      email,
      cod_vendedor,
      nro_controle,
      nro_dispositivo,
      hr_emissao,
      itens
    } = body

    console.log('Nro_controle: ' + nro_controle)
    console.log('Codigo Cliente app: ' + id_cliente)
    console.log('Condigo Consumidor Final: ' + codigoConsumidorFinal)
    console.log('nro_dispositivo: ' + nro_dispositivo)
    console.log('dt_emissão: ' + dt_emissao)
    if (id_cliente == null) {
      cliente = codigoConsumidorFinal
    } else {
      cliente = id_cliente
    }

    const result: any = await this.firebirdClient.runQuery({
      query:
        'INSERT INTO ONLINE_PEDIDO (' +
        'DT_EMISSAO, ' +
        'ID_CLIENTE, ' +
        'COD_TRANSP, ' +
        'COD_FORMA_PGTO, ' +
        'COD_BANCO, ' +
        'VLR_FRETE, ' +
        'VLR_TOTAL, ' +
        'VLR_PROD, ' +
        'TIPO_FRETE, ' +
        'OBS, ' +
        'STATUS, ' +
        'EMAIL, ' +
        'COD_VENDEDOR, ' +
        'NRO_CONTROLE, ' +
        'NRO_TABLET, ' +
        'HR_EMISSAO) ' +
        'VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) returning id',
      params: [
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
    await Promise.all(
      itens.map(async (item: any, idx: number) => {
        let observacaoGeral
        let observacaoItem

        if (obsDescricao === 'N') {
          observacaoGeral = item.obs_sabores
          observacaoItem = item.descr_prod
        } else {
          observacaoGeral = null
          if (item.obs_sabores === '') {
            observacaoItem = item.descr_prod
          } else {
            observacaoItem = item.descr_prod + ' (' + item.obs_sabores + ')'
          }
        }
        await this.firebirdClient.runQuery({
          query:
            'INSERT INTO ONLINE_PEDIDOITEM ( ' +
            'ID_PEDIDO, ' +
            'ID_PRODUTO, ' +
            'ID_SEQITEM, ' +
            'QUANTIDADE, ' +
            'VLR_UNITARIO,  ' +
            'VLR_TOTAL,  ' +
            'DESCR_PROD, ' +
            'COD_TABPRECO, ' +
            'PERC_DESCTO, ' +
            'DESCR_COMPLTO, ' +
            'CARDAPIO, ' +
            'NRO_CARDAPIO, ' +
            'FINALIZACAO, ' +
            'NRO_MESA, ' +
            'OBS_SABORES, ' +
            'QUANTIDADE2, ' +
            'UNID2, ' +
            'TIPO_ITEM) ' +
            'VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          params: [
            result.ID,
            item.id_produto,
            idx + 1,
            item.quantidade,
            item.vlr_unitario,
            item.vlr_total,
            item.descr_prod,
            item.cod_tabpreco,
            item.perc_descto,
            observacaoItem,
            item.cardapio,
            item.nro_cardapio,
            item.finalizacao,
            item.nro_mesa,
            observacaoGeral,
            item.quantidade2,
            item.unid2,
            item.tipo_item
          ]
        })

        if (idx === itens.length - 1) {
          console.log(`Comanda ${result.ID} adicionada com sucesso`)
          return {
            message: `Comanda ${result.ID} adicionada com sucesso`
          }
        }
      })
    )
    return {
      message: `Comanda ${result.ID} adicionada com sucesso`
    }
  }
}
