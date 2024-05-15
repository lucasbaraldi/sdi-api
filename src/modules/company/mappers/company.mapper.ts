import { Company } from '../entities/company.entity'

export class CompanyMapper {
  static toEntity(data: any): Company {
    return {
      cod_empresa: data.COD_EMPRESA,
      rz_social: data.RZ_SOCIAL ? data.RZ_SOCIAL.trim() : '',
      nome_fant: data.NOME_FANT ? data.NOME_FANT.trim() : '',
      endereco: data.ENDERECO ? data.ENDERECO.trim() : '',
      numero: data.NUMERO ? data.NUMERO.trim() : '',
      complemento: data.COMPLEMENTO ? data.COMPLEMENTO.trim() : '',
      bairro: data.BAIRRO ? data.BAIRRO.trim() : '',
      cod_cidade: data.COD_CIDADE,
      cep: data.CEP ? data.CEP.trim() : '',
      cnpj: data.CNPJ ? data.CNPJ.trim() : '',
      inscr_estadual: data.INSCR_ESTADUAL ? data.INSCR_ESTADUAL.trim() : '',
      fone: data.FONE ? data.FONE.trim() : '',
      fax: data.FAX ? data.FAX.trim() : '',
      email: data.EMAIL ? data.EMAIL.trim() : '',
      cod_sistema: data.COD_SISTEMA
    }
  }
}
