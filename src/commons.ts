import { FirebirdClient } from 'src/firebird/firebird.client'
import { DataSanitizer } from './utils/data-sanitizer'

import { BadRequestException, NotFoundException } from '@nestjs/common'

import * as fs from 'fs'
import * as path from 'path'

export async function buscaParametro(
  firebirdClient: FirebirdClient,
  nomeParametro: string,
  resolve: any
) {
  const result = await firebirdClient.runQuery({
    query: `SELECT valor_param FROM parametros WHERE nome_param=?`,
    params: [nomeParametro],
    buffer: (result: any) => {
      result[0]['VALOR_PARAM'](function (
        err: any,
        _name: any,
        eventEmitter: any
      ) {
        if (err) throw err

        const buffers = []
        eventEmitter.on('data', function (chunk: any) {
          buffers.push(chunk)
        })
        eventEmitter.once('end', function () {
          const buffer = Buffer.concat(buffers)
          resolve(buffer.toString())
        })
      })
    }
  })

  return result
}

export async function buscaUsuario(
  firebirdClient: FirebirdClient,
  nomeUsuario: string
): Promise<any> {
  return new Promise((resolve, reject) => {
    firebirdClient.runQuery({
      query: 'SELECT * FROM ACESSO WHERE USUARIO_APP=?',
      params: [nomeUsuario],
      buffer: (result: any) => {
        if (result.length === 0) {
          reject(new NotFoundException('Usuário não encontrado!'))
        } else if (result[0]['SENHA_APP'] === null) {
          reject(new BadRequestException('Usuário sem senha cadastrada!'))
        } else {
          resolve(result[0])
        }
      }
    })
  })
}

export async function buscaUsuarioPorCodUsuario(
  firebirdClient: FirebirdClient,
  codUsuario: number
): Promise<any> {
  return new Promise((resolve, reject) => {
    firebirdClient.runQuery({
      query: `
        SELECT COD_USUARIO, COD_EMPRESA, USUARIO, MULTI_EMPRESA, ATIVO, COD_PARAMETRO
        FROM ACESSO
        WHERE COD_USUARIO = ? AND ATIVO = 'S'
      `,
      params: [codUsuario],
      buffer: (result: any) => {
        if (result.length === 0) {
          reject(new NotFoundException('Usuário não encontrado ou inativo!'))
        } else {
          resolve(result[0])
        }
      }
    })
  })
}

export async function buscaCodSistema(
  firebirdClient: FirebirdClient
): Promise<any> {
  return new Promise((resolve, reject) => {
    firebirdClient.runQuery({
      query: 'SELECT FIRST 1 COD_SISTEMA FROM config',
      params: [],
      buffer: (result: any) => {
        if (result[0] && result[0]['COD_SISTEMA']) {
          resolve(result[0]['COD_SISTEMA'])
        } else {
          reject(new Error('Nenhum registro encontrado na tabela config!'))
        }
      }
    })
  })
}

export async function buscaVendedor(
  firebirdClient: FirebirdClient,
  nomeUsuarioApp: string
): Promise<any> {
  return new Promise((resolve, reject) => {
    firebirdClient.runQuery({
      query: `
        SELECT COD_VENDEDOR, NOME, COD_BANCO, TELEFONE, COD_EMPRESA, SENHA_APP, USUARIO_APP, COD_USUARIO
        FROM VENDEDORES
        WHERE UPPER(USUARIO_APP) = ? AND ATIVO = 'S'
      `,
      params: [nomeUsuarioApp.toUpperCase()],
      buffer: (result: any) => {
        if (result.length === 0) {
          reject(new NotFoundException('Vendedor não encontrado ou inativo!'))
        } else {
          resolve(result[0])
        }
      }
    })
  })
}

export function arredondarPreco(preco) {
  const precoNum = parseFloat(preco)
  const terceiroDecimal = Math.floor((precoNum * 1000) % 10)
  if (terceiroDecimal >= 5) {
    return (Math.ceil(precoNum * 100) / 100).toFixed(2)
  } else {
    return (Math.floor(precoNum * 100) / 100).toFixed(2)
  }
}

export async function saveLog(filename: string, data: string) {
  try {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')

    const logDir = path.join(process.cwd(), 'logs', `${month}${year}`)
    const logFile = path.join(logDir, filename)

    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true })
    }

    fs.appendFileSync(logFile, `${data}\n`, 'utf8')
    console.log(`Log salvo em ${logFile}`)
  } catch (error) {
    console.error('Erro ao salvar o log:', error)
  }
}

export function normalizeName(name: string): string {
  return name.trim().toUpperCase().replace(/\s+/g, ' ')
}

export function normalizePhoneNumber(phone?: string): string {
  if (!phone) return ''

  const numericPhone = phone.replace(/^\+55/, '').replace(/\D/g, '')

  if (numericPhone.length === 10 || numericPhone.length === 11) {
    const ddd = numericPhone.slice(0, 2)
    const prefix =
      numericPhone.length === 11
        ? numericPhone.slice(2, 7)
        : numericPhone.slice(2, 6)
    const suffix = numericPhone.slice(-4)

    return `(${ddd}) ${prefix}-${suffix}`
  }

  return ''
}

export function formatClientFields(client: any): any {
  const formatField = (value: string | null | undefined) =>
    value ? value.trim().toUpperCase() : value

  return {
    ...client,
    NOME: formatField(client.NOME),
    ENDERECO: formatField(client.ENDERECO),
    NUMERO: formatField(client.NUMERO),
    BAIRRO: formatField(client.BAIRRO),
    CELULAR: client.CELULAR?.trim(),
    TIPO_CLI: formatField(client.TIPO_CLI),
    STATUS_CLIFORN: formatField(client.STATUS_CLIFORN),
    TIPO_PESSOA: formatField(client.TIPO_PESSOA)
  }
}

export function sanitizeOrderData(orderData: any): any {
  return DataSanitizer.sanitizeObject(orderData, {
    OBS: DataSanitizer.COMMON_RULES.OBS_RULES,
    NOME_CLIENTE: DataSanitizer.COMMON_RULES.NOME_RULES,
    ENDERECO_ENTREGA: DataSanitizer.COMMON_RULES.ENDERECO_RULES,
    VLR_FRETE: DataSanitizer.COMMON_RULES.VALOR_RULES,
    VLR_TOTAL: DataSanitizer.COMMON_RULES.VALOR_RULES,
    COD_TRANSP: DataSanitizer.COMMON_RULES.CODIGO_RULES,
    COD_CLIENTE: DataSanitizer.COMMON_RULES.CODIGO_RULES
  })
}

export function sanitizeData(data: any, rules: Record<string, any> = {}): any {
  const defaultRules = {
    obs: DataSanitizer.COMMON_RULES.OBS_RULES,
    observacao: DataSanitizer.COMMON_RULES.OBS_RULES,
    observacoes: DataSanitizer.COMMON_RULES.OBS_RULES,
    nome: DataSanitizer.COMMON_RULES.NOME_RULES,
    endereco: DataSanitizer.COMMON_RULES.ENDERECO_RULES,
    email: DataSanitizer.COMMON_RULES.EMAIL_RULES,
    telefone: DataSanitizer.COMMON_RULES.TELEFONE_RULES,
    valor: DataSanitizer.COMMON_RULES.VALOR_RULES,
    preco: DataSanitizer.COMMON_RULES.VALOR_RULES,
    quantidade: DataSanitizer.COMMON_RULES.QUANTIDADE_RULES
  }

  const finalRules = { ...defaultRules, ...rules }

  return DataSanitizer.sanitizeObject(data, finalRules)
}
