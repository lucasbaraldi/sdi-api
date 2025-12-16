import { Injectable, Logger } from '@nestjs/common'

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
  private readonly logger = new Logger(FirebirdClient.name)

  constructor() {
    this.options.host = '127.0.0.1'
    this.options.port = 3050
    this.readIni()
      .then(res => {
        this.options.database = res
      })
      .catch(err => {
        this.logger.error('Failed to read database configuration', err.stack)
        throw err
      })
    this.options.user = 'SYSDBA'
    this.options.password = 'masterkey'
    this.options.charset = 'ISO8859_1'
    this.options.lowercase_keys = false
    this.options.role = null
    this.options.pageSize = 4096
    this.options.retryConnectionInterval = 1000
  }

  async runQuery({ query, params, buffer }: RunQueryInterface) {
    if (!this.options.database) {
      const error = new Error('Database not found')
      this.logger.error('Database configuration not loaded', error.stack)
      throw error
    }

    return new Promise((resolve, reject) => {
      this.firebird.attach(this.options, (err: any, db: any) => {
        if (err) {
          this.logger.error('Failed to connect to Firebird database', err.message)
          return reject(new Error(`Database connection failed: ${err.message}`))
        }

        db.query(query, params, (queryErr: any, result: any) => {
          try {
            if (queryErr) {
              this.logger.error('Query execution failed', {
                error: queryErr.message,
                query: query.substring(0, 100) + '...',
                paramCount: params?.length || 0
              })

              let errorMessage = 'Query execution failed'
              if (queryErr.message.includes('Cannot transliterate character')) {
                errorMessage = 'Character encoding error - check for special characters in data'
              } else if (queryErr.message.includes('string truncation')) {
                errorMessage = 'Data too large for database field'
              } else if (queryErr.message.includes('numeric overflow')) {
                errorMessage = 'Numeric value too large for database field'
              }

              return reject(new Error(`${errorMessage}: ${queryErr.message}`))
            }

            if (buffer) buffer(result)
            resolve(result)
          } catch (processError) {
            this.logger.error('Error processing query result', processError)
            reject(new Error('Failed to process query result'))
          } finally {
            if (db && db.detach) {
              db.detach((detachErr: any) => {
                if (detachErr) {
                  this.logger.warn('Failed to detach from database', detachErr.message)
                }
              })
            }
          }
        })
      })
    })
  }

  async readIni() {
    let caminhoGdb = ''
    let nomeGdb = ''
    const fileStream = fs.createReadStream('DBSDI.INI')

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    })

    for await (const line of rl) {
      if (line.substring(0, 1) != ';') {
        if (line.substring(0, line.indexOf('=')) == 'NOME_GDB') {
          nomeGdb = line.substring(line.indexOf('=') + 1)
        } else if (line.substring(0, line.indexOf('=')) == 'CAMINHO_GDB') {
          caminhoGdb = line.substring(line.indexOf('=') + 1)
        }
      }
    }
    return caminhoGdb + nomeGdb
  }
}
