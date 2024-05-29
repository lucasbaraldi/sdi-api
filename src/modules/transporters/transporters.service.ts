import {
  Injectable,
  NotFoundException,
  InternalServerErrorException
} from '@nestjs/common'
import { FirebirdClient } from 'src/firebird/firebird.client'

@Injectable()
export class TransportersService {
  constructor(private readonly firebirdClient: FirebirdClient) {}

  async getOneTransporter(cod_transp: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.firebirdClient.runQuery({
        query: `SELECT * FROM TRANSPORTADORES WHERE COD_TRANSP = ${cod_transp}`,
        params: [],
        buffer: (result: any, err: any) => {
          if (err) {
            reject(
              new InternalServerErrorException('Erro ao buscar transportador')
            )
          } else if (!result.length) {
            reject(
              new NotFoundException(
                `Transportador ${cod_transp} não encontrado`
              )
            )
          } else {
            const transporter = result[0]
            transporter.NOME = transporter.NOME?.trim()
            transporter.ENDERECO = transporter.ENDERECO?.trim()
            transporter.CNPJ = transporter.CNPJ?.trim()
            transporter.UF_TRANSP = transporter.UF_TRANSP?.trim()
            transporter.INSCR_ESTADUAL = transporter.INSCR_ESTADUAL?.trim()
            transporter.PLACA = transporter.PLACA?.trim()
            transporter.UF_PLACA = transporter.UF_PLACA?.trim()
            transporter.TIPO_PESSOA = transporter.TIPO_PESSOA?.trim()
            resolve(transporter)
          }
        }
      })
    })
  }

  async getAllTransporters(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.firebirdClient.runQuery({
        query: `SELECT * FROM TRANSPORTADORES WHERE STATUS = 'A' `,
        params: [],
        buffer: (result: any, err: any) => {
          if (err) {
            reject(
              new InternalServerErrorException('Erro ao buscar transportadores')
            )
          } else {
            result.forEach(transporter => {
              transporter.NOME = transporter.NOME?.trim()
              transporter.ENDERECO = transporter.ENDERECO?.trim()
              transporter.CNPJ = transporter.CNPJ?.trim()
              transporter.UF_TRANSP = transporter.UF_TRANSP?.trim()
              transporter.INSCR_ESTADUAL = transporter.INSCR_ESTADUAL?.trim()
              transporter.PLACA = transporter.PLACA?.trim()
              transporter.UF_PLACA = transporter.UF_PLACA?.trim()
              transporter.TIPO_PESSOA = transporter.TIPO_PESSOA?.trim()
            })
            resolve(result)
          }
        }
      })
    })
  }
}
