import { Controller, Get, Res, UseGuards, Logger } from '@nestjs/common'
import { AuthGuard } from 'src/middlewares/auth.guard'
import { PhotosService } from './photos.service'
import { Response } from 'express'

@Controller('photos')
export class PhotosController {
  private readonly logger = new Logger(PhotosController.name)

  constructor(private readonly photosService: PhotosService) {}

  @Get('download')
  @UseGuards(AuthGuard)
  async downloadPhotos(@Res() res: Response) {
    try {
      this.logger.debug('Starting downloadPhotos process')
      const zipPath = await this.photosService.zipProductPhotos()
      res.download(zipPath, 'product_photos.zip', err => {
        if (err) {
          this.logger.error('Error during download', err)
          throw new Error('Erro ao baixar o arquivo ZIP')
        }
      })
    } catch (err) {
      this.logger.error('Error processing request', err)
      res.status(500).send('Erro ao processar o pedido')
    }
  }
  @Get('active-products-with-photos')
  @UseGuards(AuthGuard)
  async getActiveProductsWithPhotos(@Res() res: Response) {
    try {
      this.logger.debug('Fetching active products with photos')
      const products = await this.photosService.getActiveProductPhotos()
      res.status(200).json(products)
    } catch (err) {
      this.logger.error('Error fetching active products with photos', err)
      res.status(500).send('Erro ao buscar produtos ativos com fotos')
    }
  }
}
