import { Controller, Get, UseGuards } from '@nestjs/common'
import { CityService } from './city.service'

import { AuthGuard } from 'src/middlewares/auth.guard'

@Controller('city')
export class CityController {
  constructor(private readonly CityService: CityService) {}

  @Get('/allCities')
  @UseGuards(AuthGuard)
  allCities() {
    return this.CityService.allCities()
  }
}
