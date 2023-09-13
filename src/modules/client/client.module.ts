import { Module } from '@nestjs/common'
import { FirebirdClient } from 'src/firebird/firebird.client'
import { ClientController } from './client.controller'
import { ClientService } from './client.service'
import { JwtModule } from '@nestjs/jwt'

import { AuthGuard } from 'src/middlewares/auth.guard'

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: '1h' }
    })
  ],
  controllers: [ClientController],
  providers: [ClientService, FirebirdClient, AuthGuard]
})
export class ClientModule {}
