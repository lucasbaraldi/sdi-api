/**
 * Utilitários para sanitização de dados antes de salvar no Firebird
 * Previne erros de charset, truncamento e overflow
 */

export class DataSanitizer {
  
  /**
   * Sanitiza string para charset ISO8859_1
   * Remove ou substitui caracteres que podem causar erro de transliteração
   */
  static sanitizeString(text: string | null | undefined, maxLength?: number): string | null {
    if (!text) return text as null

    let sanitized = text
      .normalize('NFD') // Decompõe caracteres acentuados
      .replace(/[\u0300-\u036f]/g, '') // Remove marcas diacríticas
      .replace(/[^\x20-\xFF]/g, '?') // Substitui caracteres fora do ISO8859_1 por ? (exceto controle)
      .trim()

    // Se especificado maxLength, trunca a string
    if (maxLength && sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength)
    }

    return sanitized
  }

  /**
   * Sanitiza string mantendo acentos básicos do ISO8859_1
   * Mapeamento manual dos caracteres mais comuns
   */
  static sanitizeStringKeepAccents(text: string | null | undefined, maxLength?: number): string | null {
    if (!text) return text as null

    // Mapeamento de caracteres Unicode para ISO8859_1 equivalentes
    const charMap: { [key: string]: string } = {
      // Aspas especiais
      '\u201c': '"', // "
      '\u201d': '"', // "
      '\u2018': "'", // '
      '\u2019': "'", // '
      '\u2013': '-', // –
      '\u2014': '-', // —
      '\u2026': '...',  // …
      // Caracteres especiais comuns em textos
      '\u20ac': 'EUR', // €
      '\u2122': '(TM)', // ™
      '\u00ae': '(R)', // ®
      '\u00a9': '(C)', // ©
      // Emojis comuns - substituir por texto
      '\ud83d\ude0a': ':)', // 😊
      '\ud83d\udc4d': '(ok)', // 👍
      '\u2764\ufe0f': '<3', // ❤️
      // Outros caracteres problemáticos
      '\u2022': '*', // •
      '\u25e6': '-' // ◦
    }

    let sanitized = text
    
    // Aplica mapeamento manual
    Object.keys(charMap).forEach(unicode => {
      sanitized = sanitized.replace(new RegExp(unicode, 'g'), charMap[unicode])
    })

    // Remove caracteres que não estão no ISO8859_1 (>255) 
    sanitized = sanitized.replace(/[^\x20-\xFF]/g, '?')
    
    sanitized = sanitized.trim()

    // Se especificado maxLength, trunca a string
    if (maxLength && sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength)
    }

    return sanitized
  }

  /**
   * Valida e ajusta valores numéricos para evitar overflow
   */
  static sanitizeNumber(value: number | string | null | undefined, type: 'smallint' | 'integer' | 'bigint' | 'decimal' = 'integer'): number | null {
    if (value === null || value === undefined || value === '') return null

    const num = typeof value === 'string' ? parseFloat(value) : value
    
    if (isNaN(num)) return null

    // Limites por tipo de campo Firebird
    const limits = {
      smallint: { min: -32768, max: 32767 },
      integer: { min: -2147483648, max: 2147483647 },
      bigint: { min: Number.MIN_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER },
      decimal: { min: -999999999999.99, max: 999999999999.99 }
    }

    const limit = limits[type]
    
    if (num < limit.min) return limit.min
    if (num > limit.max) return limit.max
    
    return num
  }

  /**
   * Sanitiza decimal com precisão específica
   */
  static sanitizeDecimal(value: number | string | null | undefined, precision: number = 2): number | null {
    const num = this.sanitizeNumber(value, 'decimal')
    if (num === null) return null
    
    return parseFloat(num.toFixed(precision))
  }

  /**
   * Sanitiza objeto completo aplicando regras por campo
   */
  static sanitizeObject<T extends Record<string, any>>(
    data: T, 
    fieldRules: { [K in keyof T]?: { type: 'string' | 'number' | 'decimal', maxLength?: number, precision?: number, numericType?: 'smallint' | 'integer' | 'bigint' | 'decimal' } }
  ): T {
    const sanitized = { ...data }

    Object.keys(fieldRules).forEach(field => {
      const rule = fieldRules[field as keyof T]
      const value = sanitized[field as keyof T]

      if (!rule) return

      switch (rule.type) {
        case 'string':
          sanitized[field as keyof T] = this.sanitizeStringKeepAccents(value, rule.maxLength) as T[keyof T]
          break
        case 'number':
          sanitized[field as keyof T] = this.sanitizeNumber(value, rule.numericType) as T[keyof T]
          break
        case 'decimal':
          sanitized[field as keyof T] = this.sanitizeDecimal(value, rule.precision) as T[keyof T]
          break
      }
    })

    return sanitized
  }

  /**
   * Regras comuns para entidades do sistema
   */
  static readonly COMMON_RULES = {
    // Para campos de observação/comentários
    OBS_RULES: { type: 'string' as const, maxLength: 500 },
    NOME_RULES: { type: 'string' as const, maxLength: 100 },
    ENDERECO_RULES: { type: 'string' as const, maxLength: 150 },
    EMAIL_RULES: { type: 'string' as const, maxLength: 100 },
    TELEFONE_RULES: { type: 'string' as const, maxLength: 20 },
    
    // Para campos numéricos
    VALOR_RULES: { type: 'decimal' as const, precision: 2, numericType: 'decimal' as const },
    CODIGO_RULES: { type: 'number' as const, numericType: 'integer' as const },
    QUANTIDADE_RULES: { type: 'decimal' as const, precision: 3, numericType: 'decimal' as const }
  }
}