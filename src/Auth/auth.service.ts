import { Injectable } from '@nestjs/common'
import { buscaUsuario } from 'src/commons'

import { FirebirdClient } from 'src/firebird/firebird.client'
import * as jwt from 'jsonwebtoken'

@Injectable()
export class AuthService {
  constructor(private readonly firebirdClient: FirebirdClient) {}

  async login(body: any): Promise<any> {
    console.log('Body: ', body)
    try {
      const result = await buscaUsuario(this.firebirdClient, body.user)

      console.log(result)

      if (
        body.user === result['USUARIO_APP'] &&
        body.password === result['SENHA']
      ) {
        const token = jwt.sign(
          {
            id: result['COD_USUARIO'],
            nome: result['USUARIO_APP']
          },
          process.env.SECRET,
          {
            expiresIn: 6000
          }
        )

        return {
          auth: true,
          token: token,
          cod_empresa: result['COD_EMPRESA']
        }
      }

      return {
        message: 'Senha inválida!'
      }
    } catch (err) {
      return {
        message: err.message
      }
    }
  }
}
