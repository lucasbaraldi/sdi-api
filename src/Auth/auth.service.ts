import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Res,
  UnauthorizedException
} from '@nestjs/common'
import { buscaCodSistema, buscaUsuario } from 'src/commons'
import { FirebirdClient } from 'src/firebird/firebird.client'
import * as jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import { Response } from 'express'

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
  async login(body: any, @Res() res: Response): Promise<any> {
    console.log('Body: ', body)
    try {
      const result = await buscaUsuario(this.firebirdClient, body.user)

      if (!result) {
        throw new NotFoundException('Usuário não encontrado')
      }

      if (body.password !== result['SENHA']) {
        throw new BadRequestException('Senha inválida!')
      }

      const codSistema = await buscaCodSistema(this.firebirdClient)
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

      return res.status(200).json({
        auth: true,
        accessToken: accessToken,
        refreshToken: refreshToken,
        cod_empresa: result['COD_EMPRESA'],
        id: result['COD_USUARIO'],
        user: result['USUARIO_APP'],
        password: result['SENHA'],
        codSistema: codSistema
      })
    } catch (err) {
      if (
        err instanceof BadRequestException ||
        err instanceof NotFoundException
      ) {
        return res.status(err.getStatus()).json({ message: err.message })
      }
      console.error('Erro ao tentar realizar login:', err)
      return res.status(500).json({
        message: 'Erro ao tentar realizar login. Por favor, tente novamente.'
      })
    }
  }

  async refreshToken(refreshToken: string, @Res() res: Response): Promise<any> {
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

      const codSistema = await buscaCodSistema(this.firebirdClient)

      return res.status(200).json({
        auth: true,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        cod_empresa: user['COD_EMPRESA'],
        id: user['COD_USUARIO'],
        user: user['USUARIO_APP'],
        password: user['SENHA'],
        codSistema: codSistema
      })
    } catch (err) {
      console.log('erro no refresh-token')
      throw new UnauthorizedException('Invalid refresh token')
    }
  }
}
