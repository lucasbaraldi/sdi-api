import { Injectable, UnauthorizedException } from '@nestjs/common'
import { buscaUsuario } from 'src/commons'
import { FirebirdClient } from 'src/firebird/firebird.client'
import * as jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'

dotenv.config()

interface JwtPayload {
  id: string
  nome: string
}

@Injectable()
export class AuthService {
  private readonly accessTokenDuration: number
  private readonly refreshTokenDuration: number

  constructor(private readonly firebirdClient: FirebirdClient) {
    this.accessTokenDuration = parseInt(process.env.ACCESS_TOKEN_DURATION)
    this.refreshTokenDuration = parseInt(process.env.REFRESH_TOKEN_DURATION)
  }

  async login(body: any): Promise<any> {
    console.log('Body: ', body)
    try {
      const result = await buscaUsuario(this.firebirdClient, body.user)

      console.log(result)

      if (
        body.user === result['USUARIO_APP'] &&
        body.password === result['SENHA']
      ) {
        const accessToken = jwt.sign(
          {
            id: result['COD_USUARIO'],
            nome: result['USUARIO_APP']
          },
          process.env.SECRET,
          {
            expiresIn: this.accessTokenDuration
          }
        )

        const refreshToken = jwt.sign(
          {
            id: result['COD_USUARIO'],
            nome: result['USUARIO_APP']
          },
          process.env.SECRET,
          {
            expiresIn: this.refreshTokenDuration
          }
        )

        return {
          auth: true,
          accessToken: accessToken,
          refreshToken: refreshToken,
          cod_empresa: result['COD_EMPRESA'],
          id: result['COD_USUARIO'],
          user: result['USUARIO_APP'],
          password: result['SENHA']
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

  async refreshToken(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const decoded: JwtPayload = jwt.verify(
        refreshToken,
        process.env.SECRET
      ) as JwtPayload

      const user = await buscaUsuario(this.firebirdClient, decoded.nome)

      const newAccessToken = jwt.sign(
        {
          id: user['COD_USUARIO'],
          nome: user['USUARIO_APP']
        },
        process.env.SECRET,
        {
          expiresIn: this.accessTokenDuration
        }
      )

      const newRefreshToken = jwt.sign(
        {
          id: user['COD_USUARIO'],
          nome: user['USUARIO_APP']
        },
        process.env.SECRET,
        {
          expiresIn: this.refreshTokenDuration
        }
      )

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    } catch (err) {
      console.log('erro  no refresh-token')
      throw new UnauthorizedException('Invalid refresh token')
    }
  }
}
