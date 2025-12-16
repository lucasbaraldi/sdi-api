import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class ComandaItemDto {
  @IsNumber()
  @ApiProperty({
    description: 'ID do produto',
    example: 71,
  })
  id_produto: number;

  @IsString()
  @ApiProperty({
    description: 'Descrição do produto',
    example: 'APEROL',
  })
  descr_prod: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Observações sobre sabores',
    example: '',
  })
  obs_sabores?: string;

  @IsNumber()
  @ApiProperty({
    description: 'Quantidade do produto',
    example: 1.5,
  })
  quantidade: number;

  @IsNumber()
  @ApiProperty({
    description: 'Valor unitário do produto',
    example: 10.5,
  })
  vlr_unitario: number;

  @IsNumber()
  @ApiProperty({
    description: 'Valor total do item',
    example: 15.75,
  })
  vlr_total: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Código da tabela de preço',
    example: 1,
  })
  cod_tabpreco?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Percentual de desconto',
    example: 0,
  })
  perc_descto?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Cardápio',
    example: 'A',
  })
  cardapio?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Número do cardápio',
    example: 1,
  })
  nro_cardapio?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Finalização',
    example: 'N',
  })
  finalizacao?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Número da mesa',
    example: null,
    nullable: true,
  })
  nro_mesa?: number | null;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Quantidade secundária',
    example: 1,
  })
  quantidade2?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Unidade secundária',
    example: 'UN',
  })
  unid2?: string;

  @IsString()
  @ApiProperty({
    description: 'Tipo do item',
    example: 'P',
  })
  tipo_item: string;
}
