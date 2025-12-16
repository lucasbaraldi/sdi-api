import { IsNotEmpty, IsString, IsOptional, MaxLength, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QuickCreateClientDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty({ 
    description: 'Nome do cliente',
    required: true,
    maxLength: 50
  })
  name: string;

  @IsString()
  @IsOptional()
  @IsPhoneNumber('BR')
  @ApiProperty({ 
    description: 'Número de celular do cliente',
    required: false,
    maxLength: 20
  })
  cellphone?: string;
}
