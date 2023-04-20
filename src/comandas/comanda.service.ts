import { Injectable } from '@nestjs/common';

import { client, options } from'../db/dbClient.js'

@Injectable()
export class ComandaService {
  getHello(): string {
    return 'Api Rodando na porta: Versão 1.2.1';
  }

  clienteComanda(nro_controle: any): any {
    client.attach(options, (err: any, db: any) => {
      if (err) throw err
      db.query(
        'SELECT R.NOME_CLIENTE, R.COD_CLIENTE, BR.NRO_CONTROLE '+
        'FROM ROMANEIOS R  INNER JOIN '+
            'BAR_ROMANEIO BR ON ( R.COD_EMPRESA = BR.COD_EMPRESA AND '+
                 'R.TIPO_CONTROL = BR.TIPO_CONTROL AND '+
                 'R.NRO_ROMANEIO = BR.NRO_ROMANEIO) '+
        'WHERE BR.NRO_CONTROLE =  '+
        nro_controle +
        "AND R.SITUACAO = 'A' "+
          [],
        function (err: any, result: any) {
          console.log(
            'Cliente da comanda ' + nro_controle + ' enviados com sucesso!'
          )
          db.detach()
        return result;
        }
      )
    })
  }

}
