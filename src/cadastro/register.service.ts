import { Injectable } from '@nestjs/common'
import { buscaParametro } from 'src/commons'

import { FirebirdClient } from 'src/firebird/firebird.client'

@Injectable()
export class RegisterService {
  constructor(private readonly firebirdClient: FirebirdClient) {}

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

  async clientes(cod_empresa: number): Promise<any> {
    let separaClientes = await new Promise((res, rej) => {
      buscaParametro(
        this.firebirdClient,
        'GER_SEPARAR_PESSOAS_EMPRESA',
        result => res(result)
      )
    })
    console.log('separaClientes: ', separaClientes)
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

  async produtosConsulta(cod_empresa: number): Promise<any> {
    let separaProdutos = await new Promise((res, rej) => {
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

  empresas(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.firebirdClient.runQuery({
        query: `
        SELECT * from empresas`,
        params: [],
        buffer: (result: any, err: any) => {
          if (err) {
            reject(err)
          } else {
            result.forEach(element => {
              element['NUMERO'] = element['NUMERO'].toString()
            })
            resolve(result)
          }
        }
      })
    })
  }
  empresa(cod_empresa: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.firebirdClient.runQuery({
        query: `
        SELECT * from empresas where cod_empresa = ${cod_empresa}`,
        params: [],
        buffer: (result: any, err: any) => {
          if (err) {
            reject(err)
          } else {
            result.forEach(result => {
              result.CNPJ = result.CNPJ.trim()
              result.INSCR_ESTADUAL = result.INSCR_ESTADUAL.trim()
              result.TRIBUTACAO_CRT = result.TRIBUTACAO_CRT.trim()
              result.TIPO_PESSOA = result.TIPO_PESSOA.trim()
              result.TIPO_SIMPLES = result.TIPO_SIMPLES.trim()
            })

            resolve(result)
          }
        }
      })
    })
  }
}
