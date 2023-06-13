import { Injectable } from '@nestjs/common';
import { buscaParametro } from 'src/commons';

import { FirebirdClient } from 'src/firebird/firebird.client';



@Injectable()
export class AuthService {
  constructor(private readonly firebirdClient: FirebirdClient) {}

//   export async function buscaUsuario(nomeUsuario: any, resolve: any, reject: any) {
    
//     const result = await firebirdClient.runQuery({
        
//         query: `SELECT * FROM ACESSO WHERE USUARIO_APP=?`,
//         params: [nomeUsuario],
//     });

//     return new Promise((resolve, reject) => {
//         result[0]['VALOR_PARAM'](function (err: any, name: any, eventEmitter: any) {
//             if (err) throw err;

//             const buffers = []
//             eventEmitter.on('data', function (chunk: any) {
//                 buffers.push(chunk)
//             })
//             eventEmitter.once('end', function () {
//                 const buffer = Buffer.concat(buffers)
//                 resolve(buffer.toString())
//             })
//         })
//     })
    
    
    
//     client.attach(options, (err, db) => {
//       if (err) throw err
//       db.query(
//         'SELECT * FROM ACESSO WHERE USUARIO_APP=?',
//         [nomeUsuario],
//         function (err, result) {
//           if (err) throw err
  
//           if (result[0] && result[0]['SENHA_APP'] === null) {
//             reject({ message: 'Usuário sem senha cadastrada!' })
//           } else if (result[0] && result[0]['USUARIO_APP']) {
//             resolve(result[0])
//           } else {
//             reject({ message: 'Usuário inválido!' })
//           }
  
//           db.detach()
//         }
//       )
//     })
//  }
}