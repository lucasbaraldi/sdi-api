import { Module } from '@nestjs/common'
import { FirebirdClient } from 'src/firebird/firebird.client'
import { CityController } from './city.controller'
import { CityService } from './city.service'
import { JwtModule } from '@nestjs/jwt'

import { AuthGuard } from 'src/middlewares/auth.guard'

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: '1h' }
    })
  ],
  controllers: [CityController],
  providers: [CityService, FirebirdClient, AuthGuard]
})
export class CityModule {}
