import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, IsDate, IsArray, ValidateNested, IsDateString } from 'class-validator';
import { ComandaItemDto } from './comanda-item.dto';
import { Type } from 'class-transformer';

export class CreateComandaDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Código da empresa',
    example: 1,
  })
  cod_empresa?: number = 1;

  @IsDateString()
  @ApiProperty({
    description: 'Data de emissão',
    example: '2024-01-01T00:00:00Z',
  })
  dt_emissao: Date;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'ID do cliente',
    example: 1,
  })
  id_cliente?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Código do transportador',
    example: 1,
  })
  cod_transp?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Código da forma de pagamento',
    example: 1,
  })
  cod_forma_pgto?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Código do banco',
    example: 1,
  })
  cod_banco?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Valor do frete',
    example: 10.5,
  })
  vlr_frete?: number;

  @IsNumber()
  @ApiProperty({
    description: 'Valor total',
    example: 100.0,
  })
  vlr_total: number;

  @IsNumber()
  @ApiProperty({
    description: 'Valor dos produtos',
    example: 90.0,
  })
  vlr_prod: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Tipo de frete',
    example: 'CIF',
  })
  tipo_frete?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Observações',
    example: 'Entregar no período da tarde',
  })
  obs?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Email do cliente',
    example: 'cliente@example.com',
  })
  email?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Código do vendedor',
    example: 1,
  })
  cod_vendedor?: number;

  @IsNumber()
  @ApiProperty({
    description: 'Número de controle',
    example: 12345,
  })
  nro_controle: number;

  @IsNumber()
  @ApiProperty({
    description: 'Número do dispositivo',
    example: 1,
  })
  nro_dispositivo: number;

  @IsString()
  @ApiProperty({
    description: 'Hora de emissão',
    example: '14:30',
  })
  hr_emissao: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ComandaItemDto)
  @ApiProperty({
    description: 'Itens da comanda',
    type: [ComandaItemDto],
  })
  itens: ComandaItemDto[];
}
