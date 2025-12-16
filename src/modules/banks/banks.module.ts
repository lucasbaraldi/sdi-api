import { Module } from '@nestjs/common'
import { FirebirdClient } from 'src/firebird/firebird.client'
import { BanksController } from './banks.controller'
import { BanksService } from './banks.service'
import { JwtModule } from '@nestjs/jwt'
import { AuthGuard } from 'src/middlewares/auth.guard'

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: '1h' }
    })
  ],
  controllers: [BanksController],
  providers: [BanksService, FirebirdClient, AuthGuard]
})
export class BanksModule {}
