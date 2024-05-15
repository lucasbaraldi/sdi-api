import { Module } from '@nestjs/common'
import { FirebirdClient } from 'src/firebird/firebird.client'
import { PaymentMethodsController } from './payment_methods.controller'
import { PaymentMethodsService } from './payment_methods.service'
import { JwtModule } from '@nestjs/jwt'
import { AuthGuard } from 'src/middlewares/auth.guard'

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: '1h' }
    })
  ],
  controllers: [PaymentMethodsController],
  providers: [PaymentMethodsService, FirebirdClient, AuthGuard]
})
export class PaymentMethodsModule {}
