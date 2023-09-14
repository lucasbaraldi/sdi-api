import { Injectable } from '@nestjs/common'

import { FirebirdClient } from 'src/firebird/firebird.client'

@Injectable()
export class CompanyService {
  constructor(private readonly firebirdClient: FirebirdClient) {}
  empresa(cod_empresa: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.firebirdClient.runQuery({
        query: `
        SELECT * from empresas where cod_empresa = ${cod_empresa}`,
        params: [],
        buffer: (r: any, err: any) => {
          if (err) {
            reject(err)
          } else {
            r.forEach(r => {
              r.CNPJ = r.CNPJ ? r.CNPJ.trim() : r.CNPJ
              r.INSCR_ESTADUAL = r.INSCR_ESTADUAL
                ? r.INSCR_ESTADUAL.trim()
                : r.INSCR_ESTADUAL
              r.TRIBUTACAO_CRT = r.TRIBUTACAO_CRT
                ? r.TRIBUTACAO_CRT.trim()
                : r.TRIBUTACAO_CRT
              r.TIPO_PESSOA = r.TIPO_PESSOA
                ? r.TIPO_PESSOA.trim()
                : r.TIPO_PESSOA
              r.TIPO_SIMPLES = r.TIPO_SIMPLES
                ? r.TIPO_SIMPLES.trim()
                : r.TIPO_SIMPLES
              r.DDD = r.DDD ? r.DDD.trim() : r.DDD
            })

            resolve(r)
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
}
