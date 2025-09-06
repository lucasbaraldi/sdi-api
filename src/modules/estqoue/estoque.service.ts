 
import { Injectable } from '@nestjs/common'
import { buscaParametro } from 'src/commons'

import { FirebirdClient } from 'src/firebird/firebird.client'

@Injectable()
export class EstoqueService {
  constructor(private readonly firebirdClient: FirebirdClient) {}

  saldoProdutos(): any {
    const date = new Date()
    const currentYear = date.getFullYear()
    const currentMonth = date.getMonth() + 1

    return new Promise((resolve, reject) => {
      this.firebirdClient.runQuery({
        query: `
        SELECT 
          cod_empresa, 
          cod_produto, 
          saldo_final + COALESCE(saldo_final2, 0) AS saldo_final, 
          ano_ref, 
          mes_ref 
        FROM 
            saldo_produtos 
        WHERE 
            ano_ref = ${currentYear} 
            AND mes_ref = ${currentMonth}
        ORDER BY 
            cod_produto, 
            cod_empresa
        `,
        params: [],
        buffer: (result: any, err: any) => {
          if (err) {
            reject(err)
          } else {
            result.forEach(r => {
              r.SALDO_FINAL = (
                Math.floor(parseFloat(r.SALDO_FINAL) * 1000) / 1000
              ).toFixed(3)
            })
            resolve(result)
          }
        }
      })
    })
  }

  saldoProduto(cod_produto: number): any {
    const date = new Date()
    const currentYear = date.getFullYear()
    const currentMonth = date.getMonth() + 1
    return this.firebirdClient.runQuery({
      query: `
              SELECT 
          cod_empresa, 
          cod_produto, 
          saldo_final + COALESCE(saldo_final2, 0) AS saldo_final, 
          ano_ref, 
          mes_ref 
        FROM 
            saldo_produtos 
        WHERE 
            ano_ref = ${currentYear} 
            AND mes_ref = ${currentMonth}
            and cod_produto = ${cod_produto}
        ORDER BY 
            cod_produto, 
            cod_empresa
      `,
      params: []
    })
  }

  async movtoEstoque(body: any) {
    const date_ob = new Date()
    const date = ('0' + date_ob.getDate()).slice(-2)
    const month = ('0' + (date_ob.getMonth() + 1)).slice(-2)
    const year = date_ob.getFullYear()

    const dataAtual = month + '/' + date + '/' + year

    let nro_doc
    let vlr_lcto = 0.0

    const { cod_produto, cod_empresa, cod_usuario, quantidade } = body

     
    nro_doc = 'APP' + date + month + year

    let codigoConsumidorFinal = await new Promise((res, rej) => {
      buscaParametro(this.firebirdClient, 'CONSUMIDORFINAL', result => {
        res(result)
      })
    })

    let cod_operEstSaida = await new Promise((res, rej) => {
      buscaParametro(this.firebirdClient, 'COD_SAIDA_EST_BALANCO', result => {
        res(result)
      })
    })

    let cod_operEstEntrada = await new Promise((res, rej) => {
      buscaParametro(this.firebirdClient, 'COD_ENTRA_EST_BALANCO', result => {
        res(result)
      })
    })

    const seq_dia = await new Promise((resolve, reject) => {
      this.firebirdClient.runQuery({
        query: `
            SELECT MAX(SEQ_DIA) AS CONTADOR 
            FROM MOVTO_ESTOQUE 
            WHERE COD_EMPRESA = ${cod_empresa} AND 
                TIPO_CONTROL = 'Q' AND 
                COD_PRODUTO = ${cod_produto} AND 
                ANO_REF = ${year} AND 
                MES_REF = ${month} AND 
                DIA_REF = ${date}
          `,
        params: [],
        buffer: (result: any, err: any) => {
          if (err) {
            reject(err)
          } else {
            if (result[0]['CONTADOR'] == '') {
              resolve(1)
            } else {
              resolve(result[0]['CONTADOR'] + 1)
            }
          }
        }
      })
    })

    const vlr_custo: number = await new Promise((resolve, reject) => {
      this.firebirdClient.runQuery({
        query: `
            select custo_atual
            from SALDO_PRODUTOS
            where ano_ref = ${year} and  
                mes_ref = ${month} and 
                cod_produto = ${cod_produto} and 
                cod_empresa = ${cod_empresa}
          `,
        params: [],
        buffer: (result: any, err: any) => {
          if (err) {
            reject(err)
          } else {
            if (result[0]['CUSTO_ATUAL'] == 0) {
              resolve(0)
            } else {
              resolve(result[0]['CUSTO_ATUAL'])
            }
          }
        }
      })
    })

    let qtd_movto, tipo_operEst, cod_operEst
    await new Promise((resolve, reject) => {
      this.firebirdClient.runQuery({
        query: `
          select saldo_final 
          from saldo_produtos 
          where ano_ref = ${year} and  
                mes_ref = ${month} and 
                cod_produto = ${cod_produto} and 
                cod_empresa = ${cod_empresa}
          `,
        params: [],
        buffer: (result: any, err: any) => {
          if (err) {
            reject(err)
          } else {
            if (result[0]['SALDO_FINAL'] > quantidade) {
              qtd_movto = result[0]['SALDO_FINAL'] - quantidade
              tipo_operEst = 'S'
              cod_operEst = cod_operEstSaida
              resolve(result)
            } else if (result[0]['SALDO_FINAL'] < quantidade) {
              qtd_movto = quantidade - result[0]['SALDO_FINAL']
              tipo_operEst = 'E'
              cod_operEst = cod_operEstEntrada
              resolve(result)
            } else if (result[0]['SALDO_FINAL'] == quantidade) {
              qtd_movto = 0
              tipo_operEst = undefined
              cod_operEst = undefined
              resolve(result)
            } else {
              console.log('erro')
            }
          }
        }
      })
    })

    await new Promise((resolve, reject) => {
      this.firebirdClient.runQuery({
        query: `
        INSERT INTO MOVTO_ESTOQUE (
        COD_EMPRESA, 
        COD_PRODUTO, 
        ANO_REF, 
        MES_REF, 
        DIA_REF, 
        SEQ_DIA, 
        NRO_DOC, 
        NRO_NF, 
        SEQ_NF, 
        QTD_MOV, 
        DT_LCTO, 
        VLR_LCTO, 
        VLR_CUSTO, 
        TIPO_OPEREST, 
        TIPO_CONTROL, 
        COD_OPEREST, 
        COD_CLIENTE) 
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
        params: [
          cod_empresa,
          cod_produto,
          year,
          month,
          date,
          seq_dia,
          nro_doc,
          0,
          0,
          qtd_movto,
          dataAtual,
          (vlr_lcto = qtd_movto * vlr_custo),
          vlr_custo,
          tipo_operEst,
          'Q',
          cod_operEst,
          codigoConsumidorFinal
        ],
        buffer: (result: any, err: any) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        }
      })
    })
    const saldo_final: number = await new Promise((resolve, reject) => {
      this.firebirdClient.runQuery({
        query: `
            SELECT saldo_final 
            FROM saldo_produtos  
            WHERE COD_EMPRESA = ${cod_empresa} AND 
                    COD_PRODUTO = ${cod_produto} AND 
                    ANO_REF = ${year} AND 
                    MES_REF = ${month}  
            `,
        params: [],
        buffer: (result: any, err: any) => {
          if (err) {
            reject(err)
          } else {
            result.forEach((r: any) => {
              r.SALDO_FINAL = parseFloat(r.SALDO_FINAL).toFixed(2)
            })
            resolve(result)
          }
        }
      })
    })
    return saldo_final
  }
}
