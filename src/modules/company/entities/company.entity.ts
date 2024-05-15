import { ApiProperty } from '@nestjs/swagger'

export class Company {
  @ApiProperty()
  cod_empresa: number

  @ApiProperty()
  rz_social: string

  @ApiProperty()
  nome_fant: string

  @ApiProperty()
  endereco: string

  @ApiProperty()
  numero: string

  @ApiProperty()
  complemento: string

  @ApiProperty()
  bairro: string

  @ApiProperty()
  cod_cidade: number

  @ApiProperty()
  cep: string

  @ApiProperty()
  cnpj: string

  @ApiProperty()
  inscr_estadual: string

  @ApiProperty()
  fone: string

  @ApiProperty()
  fax: string

  @ApiProperty()
  email: string

  @ApiProperty()
  cod_sistema: number

  constructor(data: Partial<Company>) {
    Object.assign(this, data)
  }
}
