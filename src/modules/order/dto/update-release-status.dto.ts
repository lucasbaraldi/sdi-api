import { IsString, IsNotEmpty, IsIn, IsDateString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateReleaseStatusDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['S', 'N'], { message: 'Released must be either S or N.' })
  @ApiProperty({
    example: 'S',
    description: 'Status of the release, S for released, N for not released.'
  })
  released: string

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2024-06-21T12:00:00Z',
    description: 'The release date, format: YYYY-MM-DDTHH:MM:SSZ'
  })
  releaseDate: Date

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique request ID for the release.'
  })
  requestId: string
}
