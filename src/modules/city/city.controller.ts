import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CityService } from './city.service'

import { AuthGuard } from 'src/middlewares/auth.guard'

@ApiTags('City')
@ApiBearerAuth('access-token')
@Controller('city')
export class CityController {
  constructor(private readonly CityService: CityService) {}

  @Get('/allCities')
  @UseGuards(AuthGuard)
  allCities() {
    return this.CityService.allCities()
  }
}
