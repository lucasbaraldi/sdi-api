import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerCustomOptions
} from '@nestjs/swagger'

import { INestApplication } from '@nestjs/common/interfaces'

export function swagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('SDI API')
    .setDescription('API para diversos apps da SDI')
    .setVersion('2.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Insira o token JWT',
        in: 'header'
      },
      'access-token'
    )
    .build()

  const document = SwaggerModule.createDocument(app, config)

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
      responseInterceptor: (response: Response) => {
        // Intercepta respostas do /auth/login para capturar o token
        if (response.url?.includes('/auth/login') && response.ok) {
          response
            .clone()
            .json()
            .then((data: { accessToken?: string }) => {
              if (data.accessToken) {
                // Salva o token no localStorage para persistência
                localStorage.setItem('swagger_access_token', data.accessToken)

                // Atualiza a autorização no Swagger UI
                const ui = (
                  window as Window & {
                    ui?: {
                      authActions?: { authorize: (_auth: object) => void }
                    }
                  }
                ).ui
                if (ui?.authActions) {
                  ui.authActions.authorize({
                    'access-token': {
                      name: 'access-token',
                      schema: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT'
                      },
                      value: data.accessToken
                    }
                  })
                }

                console.log('Token JWT configurado automaticamente!')
              }
            })
            .catch(() => {})
        }
        return response
      },
      onComplete: () => {
        // Restaura o token salvo ao carregar a página
        const savedToken = localStorage.getItem('swagger_access_token')
        if (savedToken) {
          setTimeout(() => {
            const ui = (
              window as Window & {
                ui?: { authActions?: { authorize: (_auth: object) => void } }
              }
            ).ui
            if (ui?.authActions) {
              ui.authActions.authorize({
                'access-token': {
                  name: 'access-token',
                  schema: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                  },
                  value: savedToken
                }
              })
              console.log('Token JWT restaurado do localStorage!')
            }
          }, 1000)
        }
      }
    }
  }

  SwaggerModule.setup('/docs/swagger', app, document, customOptions)
}
