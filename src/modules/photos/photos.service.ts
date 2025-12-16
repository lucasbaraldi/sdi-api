import { Injectable, Logger } from '@nestjs/common'
import * as fs from 'fs'
import * as path from 'path'
import * as archiver from 'archiver'
import { FirebirdClient } from 'src/firebird/firebird.client'

@Injectable()
export class PhotosService {
  private readonly logger = new Logger(PhotosService.name)

  constructor(private readonly firebirdClient: FirebirdClient) {}

  async getActiveProductPhotos(): Promise<any[]> {
    const query = `
      SELECT pf.cod_produto, pf.seq_foto, pf.nome_foto, TRIM(pf.principal) AS principal
      FROM produtos_foto pf
      JOIN produtos p ON pf.cod_produto = p.cod_produto
      WHERE p.tipo_prod = 'A'
      ORDER BY pf.cod_produto, pf.seq_foto
    `
    this.logger.debug('Running query to fetch photos of active products')
    return new Promise((resolve, reject) => {
      this.firebirdClient.runQuery({
        query,
        params: [],
        buffer: (result: any, err: any) => {
          if (err) {
            this.logger.error('Error fetching photos of active products', err)
            reject(err)
          } else {
            result.forEach(r => {
              r.PRINCIPAL = r.PRINCIPAL ? r.PRINCIPAL.trim() : r.PRINCIPAL
            })
            this.logger.debug(
              `Fetched ${result.length} photos of active products`
            )
            resolve(result)
          }
        }
      })
    })
  }

  async getActiveProductsWithPhotos(): Promise<any[]> {
    const query = `
      SELECT p.cod_produto, p.cod_empresa, p.produto_tipo, p.cod_barras, 
             p.descricao, p.complemento, p.cod_secao, p.cod_grupo, 
             p.cod_unid, p.tipo_prod, pf.seq_foto, pf.nome_foto
      FROM produtos p
      LEFT JOIN produtos_foto pf ON p.cod_produto = pf.cod_produto
      WHERE p.tipo_prod = 'A'
      ORDER BY p.cod_produto, pf.seq_foto
    `
    this.logger.debug('Running query to fetch active products with photos')
    return new Promise((resolve, reject) => {
      this.firebirdClient.runQuery({
        query,
        params: [],
        buffer: (result: any, err: any) => {
          if (err) {
            this.logger.error('Error fetching active products with photos', err)
            reject(err)
          } else {
            this.logger.debug(
              `Fetched ${result.length} active products with photos`
            )
            resolve(result)
          }
        }
      })
    })
  }

  async zipProductPhotos(): Promise<string> {
    this.logger.debug('Zipping product photos')
    const productsWithPhotos = await this.getActiveProductsWithPhotos()
    const photosDir = path.join(process.cwd(), 'Fotos')
    const zipFilePath = path.join(photosDir, 'product_photos.zip')

    this.logger.debug(`Photos directory: ${photosDir}`)
    this.logger.debug(`Zip file path: ${zipFilePath}`)

    if (!fs.existsSync(photosDir)) {
      this.logger.warn(
        `Photos directory does not exist, creating: ${photosDir}`
      )
      fs.mkdirSync(photosDir)
    }

    const output = fs.createWriteStream(zipFilePath)
    const archive = archiver('zip', {
      zlib: { level: 9 }
    })

    return new Promise((resolve, reject) => {
      output.on('close', () => {
        this.logger.debug(`Zip file created successfully: ${zipFilePath}`)
        resolve(zipFilePath)
      })
      output.on('error', err => {
        this.logger.error('Error with output stream', err)
        reject(err)
      })

      archive.on('error', err => {
        this.logger.error('Error during zipping process', err)
        reject(err)
      })

      archive.pipe(output)

      productsWithPhotos.forEach(product => {
        if (product.NOME_FOTO) {
          const photoPath = path.join(photosDir, product.NOME_FOTO)

          if (fs.existsSync(photoPath)) {
            this.logger.debug(`Adding photo to zip: ${photoPath}`)
            archive.file(photoPath, { name: product.NOME_FOTO })
          } else {
            this.logger.warn(`Photo not found: ${photoPath}`)
          }
        }
      })

      archive
        .finalize()
        .then(() => {
          this.logger.debug('Archiving process finalized')
        })
        .catch(err => {
          this.logger.error('Error finalizing archiving process', err)
        })
    })
  }
}
