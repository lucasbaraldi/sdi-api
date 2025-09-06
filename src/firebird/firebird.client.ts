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
    this.options.charset = 'ISO8859_1' // Charset configurado conforme banco Firebird
    this.options.lowercase_keys = false // set to true to lowercase keys
    this.options.role = null // default
    this.options.pageSize = 4096 // default when creating database
    this.options.retryConnectionInterval = 1000 // reconnect interval in case of connection drop
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
                query: query.substring(0, 100) + '...', // Log apenas parte da query por segurança
                paramCount: params?.length || 0
              })
              
              // Identifica tipos específicos de erro para melhor tratamento
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
            // Sempre garantir que a conexão seja fechada
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
    // eslint-disable-next-line no-useless-catch
    try {
      let caminhoGdb = ''
      let nomeGdb = ''
       
      let fileStream = fs.createReadStream('DBSDI.INI')

       
      let rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
      })

      for await (const line of rl) {
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
