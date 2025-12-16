import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

import { config } from 'dotenv'
import * as fs from 'fs'
import { ValidationPipe } from '@nestjs/common'
import * as os from 'os'
import { AllExceptionsFilter } from './filters/all-exceptions.filter'

import { swagger } from './config/swagger'

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

  // Filtro global para capturar e logar todos os erros
  app.useGlobalFilters(new AllExceptionsFilter())

  // Configurando tempo limite de requisição
  app.use((req, res, next) => {
    res.setTimeout(300000, () => {
      // 5 minutos
      console.log('Request has timed out.')
      res.sendStatus(408)
    })
    next()
  })

  swagger(app)
  const port = process.env.PORT || 3000
  await app.listen(port)

  // Obter o endereço IP da máquina
  const networkInterfaces = os.networkInterfaces()
  let ip = 'localhost'
  for (const interfaceName in networkInterfaces) {
    const interfaces = networkInterfaces[interfaceName]
    for (const iface of interfaces) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ip = iface.address
        break
      }
    }
    if (ip !== 'localhost') break
  }

  console.log(`Aplicação rodando em https://${ip}:${port}`)
}

bootstrap()
