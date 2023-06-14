import { FirebirdClient } from 'src/firebird/firebird.client'

import * as Firebird from 'node-firebird'

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
        console.log('result: ', result)
        if (result[0] && result[0]['SENHA_APP'] === null) {
          reject(new Error('Usuário sem senha cadastrada!'))
        } else if (result[0] && result[0]['USUARIO_APP']) {
          resolve(result[0])
        } else {
          reject(new Error('Usuário inválido!'))
        }
      }
    })
  })
}
