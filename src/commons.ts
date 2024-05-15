import { FirebirdClient } from 'src/firebird/firebird.client'

import * as Firebird from 'node-firebird'
import { BadRequestException, NotFoundException } from '@nestjs/common'

export async function buscaParametro(
  firebirdClient: FirebirdClient,
  nomeParametro: string,
  resolve: any
) {
  const result = await firebirdClient.runQuery({
    query: `SELECT valor_param FROM parametros WHERE nome_param=?`,
    params: [nomeParametro],
    buffer: (result: any) => {
      result[0]['VALOR_PARAM'](function (
        err: any,
        name: any,
        eventEmitter: any
      ) {
        if (err) throw err

        const buffers = []
        eventEmitter.on('data', function (chunk: any) {
          buffers.push(chunk)
        })
        eventEmitter.once('end', function () {
          const buffer = Buffer.concat(buffers)
          resolve(buffer.toString())
        })
      })
    }
  })

  return result
}

export async function buscaUsuario(
  firebirdClient: FirebirdClient,
  nomeUsuario: string
): Promise<any> {
  return new Promise((resolve, reject) => {
    firebirdClient.runQuery({
      query: 'SELECT * FROM ACESSO WHERE USUARIO_APP=?',
      params: [nomeUsuario],
      buffer: (result: any) => {
        if (result.length === 0) {
          reject(new NotFoundException('Usuário não encontrado!'))
        } else if (result[0]['SENHA_APP'] === null) {
          reject(new BadRequestException('Usuário sem senha cadastrada!'))
        } else {
          resolve(result[0])
        }
      }
    })
  })
}

export async function buscaCodSistema(
  firebirdClient: FirebirdClient
): Promise<any> {
  return new Promise((resolve, reject) => {
    firebirdClient.runQuery({
      query: 'SELECT FIRST 1 COD_SISTEMA FROM config',
      params: [],
      buffer: (result: any) => {
        if (result[0] && result[0]['COD_SISTEMA']) {
          resolve(result[0]['COD_SISTEMA'])
        } else {
          reject(new Error('Nenhum registro encontrado na tabela config!'))
        }
      }
    })
  })
}
