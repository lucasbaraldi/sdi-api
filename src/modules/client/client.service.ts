import { Injectable } from '@nestjs/common'
import { buscaParametro } from 'src/commons'

import { FirebirdClient } from 'src/firebird/firebird.client'

@Injectable()
export class ClientService {
  constructor(private readonly firebirdClient: FirebirdClient) {}

  async getAllClients(cod_empresa) {
    const separaClientes = await new Promise((res, rej) => {
      buscaParametro(
        this.firebirdClient,
        'GER_SEPARAR_PESSOAS_EMPRESA',
        result => res(result)
      )
    })
    return new Promise((resolve, reject) => {
      this.firebirdClient.runQuery({
        query:
          separaClientes == 'S'
            ? `
          select cod_cliente, nome, endereco, numero, complemento, bairro, cep, cnpj, cpf, fone, email 
          from clientes
          where STATUS_ALT = 'A' and cod_empresa = ${cod_empresa}
          order by cod_cliente
        `
            : `
          select cod_cliente, nome, endereco, numero, complemento, bairro, cep, cnpj, cpf, fone, email 
          from clientes
          where STATUS_ALT = 'A'
          order by cod_cliente
        `,
        params: [],
        buffer: (result: any, err: any) => {
          if (err) {
            reject(err)
          } else {
            result.forEach(r => {
              r.NOME = r.NOME ? r.NOME.trim() : r.NOME
              r.ENDERECO = r.ENDERECO ? r.ENDERECO.trim() : r.ENDERECO
              r.COMPLEMENTO = r.COMPLEMENTO
                ? r.COMPLEMENTO.trim()
                : r.COMPLEMENTO
              r.BAIRRO = r.BAIRRO ? r.BAIRRO.trim() : r.BAIRRO
              r.CEP = r.CEP ? r.CEP.trim() : r.CEP
              r.CNPJ = r.CNPJ ? r.CNPJ.trim() : r.CNPJ
              r.CPF = r.CPF ? r.CPF.trim() : r.CPF
              r.FONE = r.FONE ? r.FONE.trim() : r.FONE
              r.EMAIL = r.EMAIL ? r.EMAIL.trim() : r.EMAIL
            })
            resolve(result)
          }
        }
      })
    })
  }
  async getOneClient(cod_empresa: number, cod_cliente: number) {
    const separaClientes = await new Promise((res, rej) => {
      buscaParametro(
        this.firebirdClient,
        'GER_SEPARAR_PESSOAS_EMPRESA',
        result => res(result)
      )
    })
    return new Promise((resolve, reject) => {
      this.firebirdClient.runQuery({
        query:
          separaClientes == 'S'
            ? `
          select cod_cliente, nome, endereco, numero, complemento, bairro, cep, cnpj, cpf, fone, email 
          from clientes
          where STATUS_ALT = 'A' and cod_empresa = ${cod_empresa} and cod_cliente = ${cod_cliente}
          order by cod_cliente
        `
            : `
          select cod_cliente, nome, endereco, numero, complemento, bairro, cep, cnpj, cpf, fone, email 
          from clientes
          where STATUS_ALT = 'A' and cod_cliente = ${cod_cliente}
          order by cod_cliente
        `,
        params: [],
        buffer: (result: any, err: any) => {
          if (err) {
            reject(err)
          } else {
            result.forEach(r => {
              r.NOME = r.NOME ? r.NOME.trim() : r.NOME
              r.ENDERECO = r.ENDERECO ? r.ENDERECO.trim() : r.ENDERECO
              r.COMPLEMENTO = r.COMPLEMENTO
                ? r.COMPLEMENTO.trim()
                : r.COMPLEMENTO
              r.BAIRRO = r.BAIRRO ? r.BAIRRO.trim() : r.BAIRRO
              r.CEP = r.CEP ? r.CEP.trim() : r.CEP
              r.CNPJ = r.CNPJ ? r.CNPJ.trim() : r.CNPJ
              r.CPF = r.CPF ? r.CPF.trim() : r.CPF
              r.FONE = r.FONE ? r.FONE.trim() : r.FONE
              r.EMAIL = r.EMAIL ? r.EMAIL.trim() : r.EMAIL
            })
            resolve(result)
          }
        }
      })
    })
  }
}
