import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger
} from '@nestjs/common'
import { Request, Response } from 'express'
import * as fs from 'fs'
import * as path from 'path'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    // Monta objeto completo de erro
    const errorResponse = {
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      headers: this.sanitizeHeaders(request.headers),
      payload: request.body || null,
      query: request.query || null,
      params: request.params || null,
      userAgent: request.get('User-Agent') || null,
      ip: request.ip || request.connection.remoteAddress,
      statusCode: status,
      error: {
        name: (exception as any)?.name || 'Unknown',
        message:
          exception instanceof HttpException
            ? exception.getResponse()
            : (exception as any)?.message || 'Internal Server Error',
        stack: (exception as any)?.stack || null
      }
    }

    // Salva o erro em arquivo
    this.saveErrorToFile(errorResponse)

    // Log no console também
    this.logger.error('API Error caught by global filter', {
      path: request.url,
      method: request.method,
      statusCode: status,
      error: errorResponse.error.message
    })

    // Resposta padronizada para o cliente
    const clientResponse = {
      statusCode: status,
      message: this.getClientMessage(status, exception),
      timestamp: errorResponse.timestamp,
      path: request.url
    }

    response.status(status).json(clientResponse)
  }

  private sanitizeHeaders(headers: any): any {
    const sanitized = { ...headers }
    // Remove headers sensíveis
    delete sanitized.authorization
    delete sanitized.cookie
    delete sanitized['x-api-key']
    return sanitized
  }

  private getClientMessage(status: number, exception: unknown): string {
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      // Para erros 500, não expor detalhes internos
      return 'Erro interno do servidor. Equipe técnica já foi notificada.'
    }
    
    if (exception instanceof HttpException) {
      const response = exception.getResponse()
      return typeof response === 'string' ? response : (response as any)?.message || 'Erro na requisição'
    }
    
    return 'Erro na requisição'
  }

  private saveErrorToFile(errorData: any) {
    try {
      // Cria diretório de logs se não existir
      const logDir = path.join(process.cwd(), 'logs', 'errosApi')
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true })
      }

      // Nome do arquivo com data/hora
      const now = new Date()
      const dateStr = now.toISOString().split('T')[0] // YYYY-MM-DD
      const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-') // HH-MM-SS
      const fileName = `error-${dateStr}-${timeStr}-${Date.now()}.json`

      // Salva arquivo JSON com todos os detalhes
      const filePath = path.join(logDir, fileName)
      fs.writeFileSync(filePath, JSON.stringify(errorData, null, 2), { 
        encoding: 'utf8' 
      })

      // Também salva em arquivo diário consolidado
      const dailyFileName = `errors-${dateStr}.log`
      const dailyFilePath = path.join(logDir, dailyFileName)
      const logLine = `[${errorData.timestamp}] ${errorData.method} ${errorData.path} - ${errorData.statusCode} - ${errorData.error.message}\n`
      
      fs.appendFileSync(dailyFilePath, logLine, { encoding: 'utf8' })

      this.logger.debug(`Error logged to: ${fileName}`)
    } catch (loggingError) {
      this.logger.error('Failed to save error to file', loggingError)
    }
  }
}