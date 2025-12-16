import { Module } from '@nestjs/common'
import { PhotosService } from './photos.service'
import { PhotosController } from './photos.controller'
import { FirebirdClient } from 'src/firebird/firebird.client'

@Module({
  providers: [PhotosService, FirebirdClient],
  controllers: [PhotosController]
})
export class PhotosModule {}
