import { Module } from '@nestjs/common'
import { FirebirdClient } from 'src/firebird/firebird.client'
import { ProductUnitService } from './product_unit.service'
import { JwtModule } from '@nestjs/jwt'
import { AuthGuard } from 'src/middlewares/auth.guard'
import { ProductUnitController } from './product_unit.controller'

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: '1h' }
    })
  ],
  controllers: [ProductUnitController],
  providers: [ProductUnitService, FirebirdClient, AuthGuard]
})
export class ProductUnitModule {}
