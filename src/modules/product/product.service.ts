import { Injectable } from '@nestjs/common'
import { buscaParametro } from 'src/commons'
import { FirebirdClient } from 'src/firebird/firebird.client'

@Injectable()
export class ProductService {
  constructor(private readonly firebirdClient: FirebirdClient) {}

  async produtosConsulta(cod_empresa: number): Promise<any> {
    const separaProdutos = await new Promise((res, _rej) => {
      buscaParametro(
        this.firebirdClient,
        'GER_SEPARAR_PRODUTOS_EMPRESA',
        result => res(result)
      )
    })
    if (separaProdutos == 'N') {
      return new Promise((resolve, reject) => {
        return this.firebirdClient.runQuery({
          query: `
        SELECT cod_produto, cod_empresa, produto_tipo, cod_barras, 
          descricao, complemento, cod_secao, cod_grupo, cod_unid, tipo_prod, preco_venda 
          from produtos 
          where tipo_prod = 'A'  
          order by cod_produto 
      `,
          params: [],
          buffer: (result: any, err: any) => {
            if (err) {
              reject(err)
            } else {
              result.forEach(r => {
                if (r.PRECO_VENDA === 'NaN') {
                  r.PRECO_VENDA = NaN // ou r.PRECO_VENDA = null;
                } else {
                  r.PRECO_VENDA = parseFloat(r.PRECO_VENDA).toFixed(2)
                }
                r.PRODUTO_TIPO = r.PRODUTO_TIPO.trim()
                r.TIPO_PROD = r.TIPO_PROD.trim()
              })
              resolve(result)
            }
          }
        })
      })
    } else {
      return new Promise((resolve, reject) => {
        this.firebirdClient.runQuery({
          query: `
        'SELECT cod_produto, cod_empresa, produto_tipo, cod_barras, 
        descricao, complemento, cod_secao, cod_grupo, cod_unid, tipo_prod 
        from produtos 
        where cod_empresa = ${cod_empresa}
      `,
          params: [],
          buffer: (result: any, err: any) => {
            if (err) {
              reject(err)
            } else {
              result.forEach(r => {
                if (r.PRECO_VENDA === 'NaN') {
                  r.PRECO_VENDA = NaN // ou r.PRECO_VENDA = null;
                } else {
                  r.PRECO_VENDA = parseFloat(r.PRECO_VENDA).toFixed(2)
                }
                r.PRODUTO_TIPO = r.PRODUTO_TIPO.trim()
                r.TIPO_PROD = r.TIPO_PROD.trim()
              })
              resolve(result)
            }
          }
        })
      })
    }
  }

  async produto(cod_produto: number): Promise<any> {
    return new Promise((resolve, reject) => {
      return this.firebirdClient.runQuery({
        query: `
        SELECT * from produtos where cod_produto =  ${cod_produto}
    `,
        params: [],
        buffer: (result: any, err: any) => {
          if (err) {
            reject(err)
          } else {
            // result.forEach(r => {
            //   if (r.PRECO_VENDA === 'NaN') {
            //     r.PRECO_VENDA = NaN // ou r.PRECO_VENDA = null;
            //   } else {
            //     r.PRECO_VENDA = parseFloat(r.PRECO_VENDA).toFixed(2)
            //   }
            //   r.PRODUTO_TIPO = r.PRODUTO_TIPO.trim()
            //   r.TIPO_PROD = r.TIPO_PROD.trim()
            // })
            resolve(result)
          }
        }
      })
    })
  }
}
