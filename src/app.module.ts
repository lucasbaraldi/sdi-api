import { Module } from '@nestjs/common'

import { AppController } from './app.controller'

import { ComandaModule } from './modules/comanda/comanda.module'
import { AuthModule } from './Auth/auth.module'
import { EstoqueModule } from './modules/estqoue/estoque.module'
import { CityModule } from '@modules/city/city.module'
import { ProductModule } from '@modules/product/product.module'
import { PriceTableModule } from '@modules/price_table/price-table.module'
import { ClientModule } from '@modules/client/client.module'
import { CompanyModule } from '@modules/company/company.module'
import { SwaggerModule } from '@nestjs/swagger'
import { UnitOfMeasurementModule } from '@modules/unit_measurement/unit-measurement.module'
import { ProductUnitModule } from '@modules/product_unit/product_unit.modulle'
import { BanksModule } from '@modules/banks/banks.module'
import { PaymentMethodsModule } from '@modules/payment_methods/payment_methods.module'
import { TransportersModule } from '@modules/transporters/transporters.module'
import { OrderModule } from '@modules/order/order.module'
import { PhotosModule } from './modules/photos/photos.module'
import { ConfigModule } from '@modules/config/config.module'
import { TerminusModule } from '@nestjs/terminus'

@Module({
  imports: [
    TerminusModule,
    ComandaModule,
    AuthModule,
    EstoqueModule,
    CityModule,
    ProductModule,
    PriceTableModule,
    ClientModule,
    CompanyModule,
    UnitOfMeasurementModule,
    ProductUnitModule,
    SwaggerModule,
    BanksModule,
    PaymentMethodsModule,
    TransportersModule,
    OrderModule,
    PhotosModule,
    ConfigModule
  ],
  controllers: [AppController],
  providers: []
})
export class AppModule {}
