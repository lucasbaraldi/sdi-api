// config.module.ts
import { Module } from '@nestjs/common'
import { ConfigService } from './config.sevice'
import { ConfigController } from './config.controller'
import { FirebirdClient } from 'src/firebird/firebird.client'

@Module({
  controllers: [ConfigController],
  providers: [ConfigService, FirebirdClient]
})
export class ConfigModule {}
