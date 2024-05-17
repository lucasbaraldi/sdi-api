import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

import { config } from 'dotenv'
import * as fs from 'fs'
import { ValidationPipe } from '@nestjs/common'

config({
  path: '.env'
})

const httpsOptions = {
  key: fs.readFileSync('./certificate/key.pem'),
  cert: fs.readFileSync('./certificate/cert.pem'),
  secureProtocol: 'TLSv1_2_method'
}
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { httpsOptions, cors: true })
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe())
  const port = process.env.PORT || 3000
  await app.listen(port)
}
bootstrap()
