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

@Module({
  imports: [
    ComandaModule,
    AuthModule,
    EstoqueModule,
    CityModule,
    ProductModule,
    PriceTableModule,
    ClientModule,
    CompanyModule,
    SwaggerModule
  ],
  controllers: [AppController],
  providers: []
})
export class AppModule {}
