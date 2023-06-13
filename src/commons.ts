import { FirebirdClient } from 'src/firebird/firebird.client'

const Firebird = require('node-firebird')

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
