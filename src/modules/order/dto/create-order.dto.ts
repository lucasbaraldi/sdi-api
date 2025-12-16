import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min
} from 'class-validator'
import { CreateOrderItemDto } from './create-order-item.dto'
import { ApiProperty } from '@nestjs/swagger'

export class CreateOrderDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  cod_empresa: number

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  id_cliente: number

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  dt_emissao: Date

  @IsInt()
  @IsOptional()
  @ApiProperty()
  cod_transp?: number

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  cod_mepg: string

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  cod_banco: number

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  cod_forma_pgto: number

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  vlr_frete?: number

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  vlr_total: number

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  vlr_prod: number

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  tipo_frete: string

  @IsString()
  @IsOptional()
  @ApiProperty()
  obs?: string

  @IsInt()
  @IsNotEmpty()
  @Min(1, { message: 'O código do vendedor deve ser maior que 0' })
  @ApiProperty({ required: true })
  cod_vendedor: number

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  nro_controle: number

  @IsNotEmpty()
  @ApiProperty({ required: true })
  itens: CreateOrderItemDto[]
}
