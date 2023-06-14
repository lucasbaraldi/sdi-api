import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { FirebirdClient } from 'src/firebird/firebird.client'
import { RegisterController } from './register.controller'
import { RegisterService } from './register.service'
import { JwtModule } from '@nestjs/jwt'

import { AuthGuard } from 'src/middlewares/auth.guard'

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: '1h' }
    })
  ],
  controllers: [RegisterController],
  providers: [RegisterService, FirebirdClient, AuthGuard]
})
export class RegisterModule {}
