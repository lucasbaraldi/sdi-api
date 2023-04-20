const Firebird = require('node-firebird')
const fs = require('fs')
const readline = require('readline')

async function readIni() {
  try {
    let caminhoGdb = ''
    let nomeGdb = ''
    let fileStream = await fs.createReadStream('DBSDI.INI')

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
          console.log('Nome GDB: ' + nomeGdb)
        } else if (line.substring(0, line.indexOf('=')) == 'CAMINHO_GDB') {
          caminhoGdb = line.substring(line.indexOf('=') + 1)
          console.log('Caminho GDB: ' + caminhoGdb)
        }
      }
    }
    return caminhoGdb + nomeGdb
  } catch (error) {
    return error
  }
}

const options = {}

options.host = '127.0.0.1'
options.port = 3050
readIni()
  .then(res => {
    options.database = res
  })
  .catch(console.error)
options.user = 'SYSDBA'
options.password = 'masterkey'
options.lowercase_keys = false // set to true to lowercase keys
options.role = null // default
options.pageSize = 4096 // default when creating database
options.pageSize = 4096 // default when creating database
options.retryConnectionInterval = 1000 // reconnect interval in case of connection drop

module.exports = {
  client: Firebird,
  options
}
