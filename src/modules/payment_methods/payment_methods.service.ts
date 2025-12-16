import {
  Injectable,
  NotFoundException,
  InternalServerErrorException
} from '@nestjs/common'
import { FirebirdClient } from 'src/firebird/firebird.client'

@Injectable()
export class PaymentMethodsService {
  constructor(private readonly firebirdClient: FirebirdClient) {}

  async getOnePaymentMethod(cod_forma: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.firebirdClient.runQuery({
        query: `SELECT * FROM FORMAS_PAGTO WHERE COD_FORMA = ${cod_forma} WHERE SIT_FORMA = 'A'`,
        params: [],
        buffer: (result: any, err: any) => {
          if (err) {
            reject(
              new InternalServerErrorException(
                'Erro ao buscar forma de pagamento'
              )
            )
          } else if (!result.length) {
            reject(
              new NotFoundException(
                `Forma de pagamento ${cod_forma} não encontrada`
              )
            )
          } else {
            result.forEach(r => {
              r.QTD_FORMA = r.QTD_FORMA ? r.QTD_FORMA.trim() : r.QTD_FORMA
              r.SIT_FORMA = r.SIT_FORMA ? r.SIT_FORMA.trim() : r.SIT_FORMA
              r.EXIBE_APP = r.EXIBE_APP ? r.EXIBE_APP.trim() : r.EXIBE_APP
            })
            resolve(result[0])
          }
        }
      })
    })
  }

  async getAllPaymentMethods(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.firebirdClient.runQuery({
        query: `SELECT * FROM FORMAS_PAGTO
                WHERE SIT_FORMA = 'A' AND EXIBE_APP = 'S'`,
        params: [],
        buffer: (result: any, err: any) => {
          if (err) {
            reject(
              new InternalServerErrorException(
                'Erro ao buscar formas de pagamento'
              )
            )
          } else {
            result.forEach(r => {
              r.QTD_FORMA = r.QTD_FORMA ? r.QTD_FORMA.trim() : r.QTD_FORMA
              r.SIT_FORMA = r.SIT_FORMA ? r.SIT_FORMA.trim() : r.SIT_FORMA
              r.EXIBE_APP = r.EXIBE_APP ? r.EXIBE_APP.trim() : r.EXIBE_APP
            })
            resolve(result)
          }
        }
      })
    })
  }

  async getPaymentMethods(param1: number, param2: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.firebirdClient.runQuery({
        query: `SELECT * FROM SP_MEIOS_PAGTO(${param1}, ${param2})`,
        params: [],
        buffer: (result: any, err: any) => {
          if (err) {
            reject(
              new InternalServerErrorException(
                'Erro ao buscar meios de pagamento'
              )
            )
          } else {
            const filteredResult = result.filter(
              (r: any) => r.EXIBE_APP?.trim() === 'S'
            )

            filteredResult.forEach((r: any) => {
              r.COD_MEPG = r.COD_MEPG ? r.COD_MEPG.trim() : r.COD_MEPG
              r.DESCRICAO = r.DESCRICAO ? r.DESCRICAO.trim() : r.DESCRICAO
              r.TIPO_PAGTO = r.TIPO_PAGTO ? r.TIPO_PAGTO.trim() : r.TIPO_PAGTO
              r.PAGTO_PRINCIPAL = r.PAGTO_PRINCIPAL
                ? r.PAGTO_PRINCIPAL.trim()
                : r.PAGTO_PRINCIPAL
              r.TIPO_MOVTO = r.TIPO_MOVTO ? r.TIPO_MOVTO.trim() : r.TIPO_MOVTO
              r.STATUS = r.STATUS ? r.STATUS.trim() : r.STATUS
              r.TIPO_MEIO = r.TIPO_MEIO ? r.TIPO_MEIO.trim() : r.TIPO_MEIO
              r.BAIXA_AUTO_CTR = r.BAIXA_AUTO_CTR
                ? r.BAIXA_AUTO_CTR.trim()
                : r.BAIXA_AUTO_CTR
              r.TEF_MSTR_MODAL = r.TEF_MSTR_MODAL
                ? r.TEF_MSTR_MODAL.trim()
                : r.TEF_MSTR_MODAL
              r.TEF_INTEGRADO = r.TEF_INTEGRADO
                ? r.TEF_INTEGRADO.trim()
                : r.TEF_INTEGRADO
              r.EXIBE_APP = r.EXIBE_APP ? r.EXIBE_APP.trim() : r.EXIBE_APP
            })

            resolve(filteredResult)
          }
        }
      })
    })
  }
}
