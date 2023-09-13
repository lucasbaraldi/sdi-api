import { Injectable } from '@nestjs/common'

import { FirebirdClient } from 'src/firebird/firebird.client'

@Injectable()
export class PriceTableService {
  constructor(private readonly firebirdClient: FirebirdClient) {}

  async tabPreco(cod_produto: number): Promise<any> {
    return new Promise((resolve, reject) => {
      return this.firebirdClient.runQuery({
        query: `
        SELECT * from tabela_Precos where cod_produto =  ${cod_produto}
    `,
        params: [],
        buffer: (result: any, err: any) => {
          if (err) {
            reject(err)
          } else {
            result.forEach(r => {
              r.PRECO_VENDA = parseFloat(r.PRECO_VENDA).toFixed(2)
            })
            console.log(
              'Tabela de preco do produto ' + cod_produto + ' enviado'
            )
            resolve(result)
          }
        }
      })
    })
  }

  async tabPrecos(): Promise<any> {
    return new Promise((resolve, reject) => {
      return this.firebirdClient.runQuery({
        query: `
        select cod_produto, seq_tabela, preco_venda, descr_tabela from tabela_precos
    `,
        params: [],
        buffer: (result: any, err: any) => {
          if (err) {
            reject(err)
          } else {
            result.forEach(r => {
              r.PRECO_VENDA = parseFloat(r.PRECO_VENDA).toFixed(2)
            })
            console.log('Tabela de Preços enviada')
            resolve(result)
          }
        }
      })
    })
  }

  async precoVenda(body: any): Promise<any> {
    const date_ob = new Date()
    const date = ('0' + date_ob.getDate()).slice(-2)
    const month = ('0' + (date_ob.getMonth() + 1)).slice(-2)
    const year = date_ob.getFullYear()

    const dataAtual = month + '/' + date + '/' + year

    const { cod_produto, cod_emresa, seq_tabela, cod_usuario, preco_venda } =
      body

    const result = await new Promise((resolve, reject) => {
      return this.firebirdClient.runQuery({
        query: `
        UPDATE TABELA_PRECOS
        SET PRECO_VENDA = ${preco_venda}, DT_ALT_PRECO = '${dataAtual}'
        WHERE COD_PRODUTO = ${cod_produto} AND
        SEQ_TABELA = ${seq_tabela}
    `,
        params: [],
        buffer: (result: any, err: any) => {
          if (err) {
            reject(err)
          } else {
            console.log(
              'Tabela ' +
                seq_tabela +
                ' do produto ' +
                cod_produto +
                ' atualizado com sucesso!'
            )
            resolve(true)
          }
        }
      })
    })
    if (result == true) {
      return new Promise((resolve, reject) => {
        this.firebirdClient.runQuery({
          query: `
          select preco_venda from tabela_precos 
            where cod_produto = ${cod_produto} 
              and seq_tabela = ${seq_tabela} 
          `,
          params: [],
          buffer: (result: any, err: any) => {
            if (err) {
              reject(err)
            } else {
              result.forEach(r => {
                r.PRECO_VENDA = parseFloat(r.PRECO_VENDA).toFixed(2)
              })
              resolve(result[0])
            }
          }
        })
      })
    } else {
      return {
        message: `Não foi possivel atualizar o preço de venda do produto`
      }
    }
  }
}
