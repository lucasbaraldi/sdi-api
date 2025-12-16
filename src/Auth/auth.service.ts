import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Res,
  UnauthorizedException
} from '@nestjs/common'
import {
  buscaCodSistema,
  buscaParametro,
  buscaVendedor,
  buscaUsuarioPorCodUsuario
} from 'src/commons'
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
  private readonly accessTokenDuration: string
  private readonly refreshTokenDuration: string

  constructor(private readonly firebirdClient: FirebirdClient) {
    this.accessTokenDuration = process.env.ACCESS_TOKEN_DURATION
    this.refreshTokenDuration = process.env.REFRESH_TOKEN_DURATION
  }

  async login(body: any, @Res() res: Response): Promise<any> {
    try {
      const vendedor = await buscaVendedor(this.firebirdClient, body.user)
      if (!vendedor) {
        throw new NotFoundException('Usuário não encontrado ou inativo')
      }

      if (body.password !== vendedor['SENHA_APP']) {
        throw new BadRequestException('Senha inválida!')
      }

      const usuario = await buscaUsuarioPorCodUsuario(
        this.firebirdClient,
        vendedor['COD_USUARIO']
      )

      const codSistema = await buscaCodSistema(this.firebirdClient)

      const parametroBloqueiaVendaAbaixoDaMargem = await new Promise(
        (res, _rej) => {
          buscaParametro(
            this.firebirdClient,
            'PEDIDO_ONLINE_USA_BLOQUEIO_VENDA_PRECO_MINIMO',
            result => res(result)
          )
        }
      )

      const accessToken = jwt.sign(
        {
          id: vendedor['COD_VENDEDOR'],
          nome: vendedor['USUARIO_APP']
        },
        process.env.SECRET,
        {
          expiresIn: this.accessTokenDuration
        }
      )

      const refreshToken = jwt.sign(
        {
          id: vendedor['COD_VENDEDOR'],
          nome: vendedor['USUARIO_APP']
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
        cod_empresa: vendedor['COD_EMPRESA'],
        codSistema: codSistema,

        PEDIDO_ONLINE_USA_BLOQUEIO_VENDA_PRECO_MINIMO:
          parametroBloqueiaVendaAbaixoDaMargem,
        user: {
          COD_USUARIO: usuario['COD_USUARIO'],
          COD_EMPRESA: usuario['COD_EMPRESA'],
          COD_PARAMETRO: usuario['COD_PARAMETRO'],
          USUARIO: usuario['USUARIO'],
          MULTI_EMPRESA: usuario['MULTI_EMPRESA'].trim(),
          MOSTRA_CUSTO_VENDA: usuario['MOSTRA_CUSTO_VENDA']
        },
        vendedor: {
          COD_VENDEDOR: vendedor['COD_VENDEDOR'],
          NOME: vendedor['NOME'],
          COD_BANCO: vendedor['COD_BANCO'],
          TELEFONE: vendedor['TELEFONE'],
          COD_EMPRESA: vendedor['COD_EMPRESA']
        }
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

      const vendedor = await buscaVendedor(this.firebirdClient, decoded.nome)

      const usuario = await buscaUsuarioPorCodUsuario(
        this.firebirdClient,
        vendedor['COD_USUARIO']
      )

      const parametroBloqueiaVendaAbaixoDaMargem = await new Promise(
        (res, _rej) => {
          buscaParametro(
            this.firebirdClient,
            'PEDIDO_ONLINE_USA_BLOQUEIO_VENDA_PRECO_MINIMO',
            result => res(result)
          )
        }
      )

      const newAccessToken = jwt.sign(
        {
          id: vendedor['COD_VENDEDOR'],
          nome: vendedor['USUARIO_APP']
        },
        process.env.SECRET,
        {
          expiresIn: this.accessTokenDuration
        }
      )

      const newRefreshToken = jwt.sign(
        {
          id: vendedor['COD_VENDEDOR'],
          nome: vendedor['USUARIO_APP']
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
        cod_empresa: vendedor['COD_EMPRESA'],
        codSistema: codSistema,
        PEDIDO_ONLINE_USA_BLOQUEIO_VENDA_PRECO_MINIMO:
          parametroBloqueiaVendaAbaixoDaMargem,
        user: {
          COD_USUARIO: usuario['COD_USUARIO'],
          COD_EMPRESA: usuario['COD_EMPRESA'],
          COD_PARAMETRO: usuario['COD_PARAMETRO'],
          USUARIO: usuario['USUARIO'],
          MULTI_EMPRESA: usuario['MULTI_EMPRESA'],
          MOSTRA_CUSTO_VENDA: usuario['MOSTRA_CUSTO_VENDA']
        },
        vendedor: {
          COD_VENDEDOR: vendedor['COD_VENDEDOR'],
          NOME: vendedor['NOME'],
          COD_BANCO: vendedor['COD_BANCO'],
          TELEFONE: vendedor['TELEFONE'],
          COD_EMPRESA: vendedor['COD_EMPRESA']
        }
      })
    } catch (err) {
      console.log('erro no refresh-token', err)
      if (
        err instanceof UnauthorizedException ||
        err instanceof jwt.JsonWebTokenError
      ) {
        return res
          .status(401)
          .json({ message: 'Token de atualização inválido ou expirado' })
      }
      return res.status(500).json({
        message:
          'Erro interno ao atualizar o token. Por favor, tente novamente mais tarde.'
      })
    }
  }
}
