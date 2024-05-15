import { Module } from '@nestjs/common'
import { FirebirdClient } from 'src/firebird/firebird.client'
import { TransportersController } from './transporters.controller'
import { TransportersService } from './transporters.service'
import { JwtModule } from '@nestjs/jwt'
import { AuthGuard } from 'src/middlewares/auth.guard'

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: '1h' }
    })
  ],
  controllers: [TransportersController],
  providers: [TransportersService, FirebirdClient, AuthGuard]
})
export class TransportersModule {}
