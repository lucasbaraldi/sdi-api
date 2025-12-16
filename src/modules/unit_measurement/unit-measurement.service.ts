import {
  Injectable,
  NotFoundException,
  InternalServerErrorException
} from '@nestjs/common'
import { FirebirdClient } from 'src/firebird/firebird.client'

@Injectable()
export class UnitOfMeasurementService {
  constructor(private readonly firebirdClient: FirebirdClient) {}

  async getOneUnit(cod_unid: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.firebirdClient.runQuery({
        query: `SELECT * FROM UNIDADES WHERE COD_UNID = ${cod_unid}`,
        params: [],
        buffer: (result: any, err: any) => {
          if (err) {
            reject(
              new InternalServerErrorException(
                'Erro ao buscar unidade de medida'
              )
            )
          } else if (!result.length) {
            reject(
              new NotFoundException(
                `Unidade de medida ${cod_unid} não encontrada`
              )
            )
          } else {
            console.log(`Unidade de medida ${cod_unid} enviada`)
            const unit = result[0]
            unit.DESCR_ABREV = unit.DESCR_ABREV
              ? unit.DESCR_ABREV.trim()
              : unit.DESCR_ABREV
            unit.DESCRICAO = unit.DESCRICAO
              ? unit.DESCRICAO.trim()
              : unit.DESCRICAO
            unit.STATUS_ALT = unit.STATUS_ALT
              ? unit.STATUS_ALT.trim()
              : unit.STATUS_ALT
            resolve(unit)
          }
        }
      })
    })
  }

  async getAllUnits(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.firebirdClient.runQuery({
        query: `SELECT * FROM UNIDADES`,
        params: [],
        buffer: (result: any, err: any) => {
          if (err) {
            reject(
              new InternalServerErrorException(
                'Erro ao buscar unidades de medida'
              )
            )
          } else {
            console.log('Todas as unidades de medida enviadas')
            result.forEach(unit => {
              unit.DESCR_ABREV = unit.DESCR_ABREV
                ? unit.DESCR_ABREV.trim()
                : unit.DESCR_ABREV
              unit.DESCRICAO = unit.DESCRICAO
                ? unit.DESCRICAO.trim()
                : unit.DESCRICAO
              unit.STATUS_ALT = unit.STATUS_ALT
                ? unit.STATUS_ALT.trim()
                : unit.STATUS_ALT
            })
            resolve(result)
          }
        }
      })
    })
  }
}
