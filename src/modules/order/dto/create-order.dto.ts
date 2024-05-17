import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator'
import { CreateOrderItemDto } from './create-order-item.dto'
import { ApiProperty } from '@nestjs/swagger'

export class CreateOrderDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  id_cliente: number

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  dt_emissao: Date

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  cod_transp: number

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  cod_banco: number

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  vlr_frete: number

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
  @ApiProperty({ required: false })
  obs?: string

  @IsInt()
  @IsNotEmpty()
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
