import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
  IsNumber
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateReleaseOrderDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  salesRepId: number

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  productId: number

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  requestId: string

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  creationDate: Date

  @IsString()
  @IsOptional()
  @ApiProperty({ default: 'N' })
  released?: string = 'N'

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  originalPrice: number

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  salePrice: number
}
