import {
  Injectable,
  NotFoundException,
  InternalServerErrorException
} from '@nestjs/common'
import { FirebirdClient } from 'src/firebird/firebird.client'

@Injectable()
export class ProductUnitService {
  constructor(private readonly firebirdClient: FirebirdClient) {}

  async getOneProductUnit(cod_produto: number, cod_unid: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.firebirdClient.runQuery({
        query: `SELECT * FROM UNID_MEDIDAS_PROD WHERE COD_PRODUTO = ${cod_produto} AND COD_UNID = ${cod_unid}`,
        params: [],
        buffer: (result: any, err: any) => {
          if (err) {
            reject(
              new InternalServerErrorException(
                'Erro ao buscar unidade de medida do produto'
              )
            )
          } else if (!result.length) {
            reject(
              new NotFoundException(
                `Unidade de medida do produto não encontrada: COD_PRODUTO ${cod_produto}, COD_UNID ${cod_unid}`
              )
            )
          } else {
            console.log(
              `Unidade de medida do produto enviada: COD_PRODUTO ${cod_produto}, COD_UNID ${cod_unid}`
            )
            const productUnit = result[0]
            productUnit.QTD_POR_UNID = productUnit.QTD_POR_UNID
              ? productUnit.QTD_POR_UNID.toFixed(3)
              : productUnit.QTD_POR_UNID
            productUnit.VLR_UNID = productUnit.VLR_UNID
              ? productUnit.VLR_UNID.toFixed(3)
              : productUnit.VLR_UNID
            productUnit.PADRAO_VENDA = productUnit.PADRAO_VENDA
              ? productUnit.PADRAO_VENDA.trim()
              : productUnit.PADRAO_VENDA
            productUnit.TIPO_USO = productUnit.TIPO_USO
              ? productUnit.TIPO_USO.trim()
              : productUnit.TIPO_USO
            resolve(productUnit)
          }
        }
      })
    })
  }

  async getAllProductUnits(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.firebirdClient.runQuery({
        query: `SELECT * FROM UNID_MEDIDAS_PROD`,
        params: [],
        buffer: (result: any, err: any) => {
          if (err) {
            reject(
              new InternalServerErrorException(
                'Erro ao buscar unidades de medida dos produtos'
              )
            )
          } else {
            console.log('Todas as unidades de medida dos produtos enviadas')
            result.forEach(productUnit => {
              productUnit.QTD_POR_UNID = productUnit.QTD_POR_UNID
                ? productUnit.QTD_POR_UNID.toFixed(3)
                : productUnit.QTD_POR_UNID
              productUnit.VLR_UNID = productUnit.VLR_UNID
                ? productUnit.VLR_UNID.toFixed(3)
                : productUnit.VLR_UNID
              productUnit.PADRAO_VENDA = productUnit.PADRAO_VENDA
                ? productUnit.PADRAO_VENDA.trim()
                : productUnit.PADRAO_VENDA
              productUnit.TIPO_USO = productUnit.TIPO_USO
                ? productUnit.TIPO_USO.trim()
                : productUnit.TIPO_USO
            })
            resolve(result)
          }
        }
      })
    })
  }
}
