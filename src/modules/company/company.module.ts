import { Module } from '@nestjs/common'
import { FirebirdClient } from 'src/firebird/firebird.client'
import { CompanyController } from './company.controller'
import { CompanyService } from './company.service'
import { JwtModule } from '@nestjs/jwt'

import { AuthGuard } from 'src/middlewares/auth.guard'

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: '1h' }
    })
  ],
  controllers: [CompanyController],
  providers: [CompanyService, FirebirdClient, AuthGuard]
})
export class CompanyModule {}
