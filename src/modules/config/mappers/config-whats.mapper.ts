import { ConfigWhats } from '../entities/config-whats.entity'

export class ConfigWhatsMapper {
  static toEntity(data: any): ConfigWhats {
    return {
      codEmpresa: data.COD_EMPRESA,
      codParametro: data.COD_PARAMETRO,
      apiKey: data.API_KEY,
      nroFoneBase: data.NRO_FONE_BASE,
      msgPadraoNfbl: data.MSG_PADRAO_NFBL,
      tipoConta: data.TIPO_CONTA ? data.TIPO_CONTA.trim() : '',
      userWhatsGw: data.USER_WHATS_GW,
      senhaWhatsGw: data.SENHA_WHATS_GW,
      codUsuario: data.COD_USUARIO,
      notEnvMsg: data.NOT_ENV_MSG ? data.NOT_ENV_MSG.trim() : ''
    }
  }
}
