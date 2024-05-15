import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

import { INestApplication } from '@nestjs/common/interfaces'

export function swagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('SDI API')
    .setDescription('API para diversos apps da SDI')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('/docs/swagger', app, document)
}
