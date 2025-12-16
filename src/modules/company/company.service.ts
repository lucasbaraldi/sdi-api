import { Injectable } from '@nestjs/common'

import { FirebirdClient } from 'src/firebird/firebird.client'
import { Company } from './entities/company.entity'
import { CompanyMapper } from './mappers/company.mapper'

@Injectable()
export class CompanyService {
  constructor(private readonly firebirdClient: FirebirdClient) {}
  // empresa(cod_empresa: number): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this.firebirdClient.runQuery({
  //       query: `
  //       SELECT COD_EMPRESA, RZ_SOCIAL, NOME_FANT, ENDERECO, NUMERO, COMPLEMENTO, BAIRRO, COD_CIDADE, CEP, CNPJ, INSCR_ESTADUAL, FONE, FAX, EMAIL, COD_SISTEMA
  //       from empresas
  //       where cod_empresa = ${cod_empresa}`,
  //       params: [],
  //       buffer: (r: any, err: any) => {
  //         if (err) {
  //           reject(err)
  //         } else {
  //           r.forEach(r => {
  //             r.CNPJ = r.CNPJ ? r.CNPJ.trim() : r.CNPJ
  //             r.INSCR_ESTADUAL = r.INSCR_ESTADUAL
  //               ? r.INSCR_ESTADUAL.trim()
  //               : r.INSCR_ESTADUAL
  //             r.COMPLEMENTO = r.COMPLEMENTO
  //               ? r.COMPLEMENTO.trim()
  //               : r.COMPLEMENTO
  //             r.FONE = r.FONE ? r.FONE.trim() : r.FONE
  //             r.FAX = r.FAX ? r.FAX.trim() : r.FAX
  //           })

  //           resolve(r)
  //         }
  //       }
  //     })
  //   })
  // }
  empresa(cod_empresa: number): Promise<Company> {
    return new Promise((resolve, reject) => {
      this.firebirdClient.runQuery({
        query: `
            SELECT COD_EMPRESA, RZ_SOCIAL, NOME_FANT, ENDERECO, NUMERO, COMPLEMENTO, BAIRRO, COD_CIDADE, CEP, CNPJ, INSCR_ESTADUAL, FONE, FAX, EMAIL, COD_SISTEMA 
            from empresas 
            where cod_empresa = ${cod_empresa}`,
        params: [],
        buffer: (r: any, err: any) => {
          if (err) {
            reject(err)
          } else {
            const empresaRaw = r[0]

            const empresaObj = new Company(CompanyMapper.toEntity(empresaRaw))
            resolve(empresaObj)
          }
        }
      })
    })
  }

  // empresas(): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this.firebirdClient.runQuery({
  //       query: `
  //       SELECT * from empresas`,
  //       params: [],
  //       buffer: (result: any, err: any) => {
  //         if (err) {
  //           reject(err)
  //         } else {
  //           result.forEach(element => {
  //             element['NUMERO'] = element['NUMERO'].toString()
  //           })
  //           resolve(result)
  //         }
  //       }
  //     })
  //   })
  // }

  empresas(): Promise<Company[]> {
    return new Promise((resolve, reject) => {
      this.firebirdClient.runQuery({
        query: `SELECT * from empresas`,
        params: [],
        buffer: (results: any[], err: any) => {
          if (err) {
            reject(err)
          } else {
            const empresas = results.map(result =>
              CompanyMapper.toEntity(result)
            )
            resolve(empresas)
          }
        }
      })
    })
  }
}
