import { Injectable } from '@nestjs/common'
import { resolve } from 'path'
import { buscaParametro } from 'src/commons'

import { FirebirdClient } from 'src/firebird/firebird.client'

@Injectable()
export class RegisterService {
  constructor(private readonly firebirdClient: FirebirdClient) {}

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
