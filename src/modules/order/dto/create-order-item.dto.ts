import { ApiProperty } from '@nestjs/swagger'
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min
} from 'class-validator'

export class CreateOrderItemDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  id_produto: number

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  id_seqitem: number

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  quantidade: number

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  vlr_unitario: number

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  vlr_total: number

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  descr_prod: string

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  cod_tabpreco: number

  @IsNumber({ maxDecimalPlaces: 4 }) // Validação para até 4 casas decimais
  @Min(0)
  @IsNotEmpty()
  @ApiProperty({ required: true })
  perc_descto: number

  @IsNumber()
  @Min(0)
  @IsOptional()
  quantidade2?: number

  @IsNumber()
  @Min(0)
  @IsOptional()
  unid2?: number
}
