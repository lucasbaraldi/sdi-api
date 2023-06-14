import { Injectable } from '@nestjs/common'

import * as Firebird from 'node-firebird'
import * as fs from 'fs'
import * as readline from 'readline'

export interface RunQueryInterface {
  query: string
  params: any[]
  buffer?: any
}

@Injectable()
export class FirebirdClient {
  private readonly options: any = {}
  private readonly firebird = Firebird

  constructor() {
    this.options.host = '127.0.0.1'
    this.options.port = 3050
    this.readIni()
      .then(res => {
        this.options.database = res
      })
      .catch(err => {
        throw err
      })
    this.options.user = 'SYSDBA'
    this.options.password = 'masterkey'
    this.options.lowercase_keys = false // set to true to lowercase keys
    this.options.role = null // default
    this.options.pageSize = 4096 // default when creating database
    this.options.retryConnectionInterval = 1000 // reconnect interval in case of connection drop
  }

  async runQuery({ query, params, buffer }: RunQueryInterface) {
    if (!this.options.database) throw new Error('Database not found')

    let resultQuery = await new Promise((resolve, reject) => {
      this.firebird.attach(this.options, (err: any, db: any) => {
        if (err) throw err

        db.query(query, params, (err: any, result: any) => {
          if (err) throw err

          if (buffer) buffer(result)

          resolve(result)

          db.detach()
        })
      })
    })

    return resultQuery
  }

  async readIni() {
    try {
      let caminhoGdb = ''
      let nomeGdb = ''
      let fileStream = fs.createReadStream('DBSDI.INI')

      let rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
      })

      for await (let line of rl) {
        // Each line in input.txt will be successively available here as `line`.
        //console.log(`Line from file: ${line}`)
        if (line.substring(0, 1) != ';') {
          if (line.substring(0, line.indexOf('=')) == 'NOME_GDB') {
            nomeGdb = line.substring(line.indexOf('=') + 1)
          } else if (line.substring(0, line.indexOf('=')) == 'CAMINHO_GDB') {
            caminhoGdb = line.substring(line.indexOf('=') + 1)
          }
        }
      }
      return caminhoGdb + nomeGdb
    } catch (error) {
      throw error
    }
  }
}
