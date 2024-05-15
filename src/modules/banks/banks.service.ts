import {
  Injectable,
  NotFoundException,
  InternalServerErrorException
} from '@nestjs/common'
import { FirebirdClient } from 'src/firebird/firebird.client'

@Injectable()
export class BanksService {
  constructor(private readonly firebirdClient: FirebirdClient) {}

  async getOneBank(cod_banco: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.firebirdClient.runQuery({
        query: `SELECT * FROM BANCOS WHERE COD_BANCO = ${cod_banco}`,
        params: [],
        buffer: (result: any, err: any) => {
          if (err) {
            reject(new InternalServerErrorException('Erro ao buscar banco'))
          } else if (!result.length) {
            reject(new NotFoundException(`Banco ${cod_banco} não encontrado`))
          } else {
            resolve(result[0])
          }
        }
      })
    })
  }

  async getAllBanks(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.firebirdClient.runQuery({
        query: `SELECT * FROM BANCOS`,
        params: [],
        buffer: (result: any, err: any) => {
          if (err) {
            reject(new InternalServerErrorException('Erro ao buscar bancos'))
          } else {
            resolve(result)
          }
        }
      })
    })
  }
}
