import { Module } from '@nestjs/common'
import { FirebirdClient } from 'src/firebird/firebird.client'
import { UnitOfMeasurementController } from './unit-measurement.controller'
import { UnitOfMeasurementService } from './unit-measurement.service'
import { JwtModule } from '@nestjs/jwt'

import { AuthGuard } from 'src/middlewares/auth.guard'

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: '1h' }
    })
  ],
  controllers: [UnitOfMeasurementController],
  providers: [UnitOfMeasurementService, FirebirdClient, AuthGuard]
})
export class UnitOfMeasurementModule {}
