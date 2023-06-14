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
    return this.firebirdClient.runQuery({
      query: `
      select cod_empresa, cod_produto, saldo_final, ano_ref, mes_ref 
        from saldo_produtos 
        where ano_ref = ${currentYear} 
            and mes_ref = ${currentMonth}
        order by cod_produto, cod_empresa
      `,
      params: []
    })
  }
  saldoProduto(cod_produto: number): any {
    const date = new Date()
    const currentYear = date.getFullYear()
    const currentMonth = date.getMonth() + 1
    return this.firebirdClient.runQuery({
      query: `
      select cod_empresa, cod_produto, saldo_final, ano_ref, mes_ref 
        from saldo_produtos 
        where ano_ref = ${currentYear} 
            and mes_ref = ${currentMonth}
            and cod_produto = ${cod_produto}
        order by cod_produto, cod_empresa
      `,
      params: []
    })
  }
}
