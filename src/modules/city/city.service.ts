import { Injectable } from '@nestjs/common'

import { FirebirdClient } from 'src/firebird/firebird.client'

@Injectable()
export class CityService {
  constructor(private readonly firebirdClient: FirebirdClient) {}
  async allCities(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.firebirdClient.runQuery({
        query: `       
          select cod_cidade, nome, uf, cod_regiao, cod_nacional, cep 
          from cidades
          order by cod_cidade
        `,
        params: [],
        buffer: (result: any, err: any) => {
          if (err) {
            reject(err)
          } else {
            result.forEach(r => {
              r.NOME = r.NOME ? r.NOME.trim() : r.NOME
              r.UF = r.UF ? r.UF.trim() : r.UF
              r.COD_REGIAO = r.COD_REGIAO ? r.COD_REGIAO.trim() : r.COD_REGIAO
            })
            resolve(result)
          }
        }
      })
    })
  }
}
