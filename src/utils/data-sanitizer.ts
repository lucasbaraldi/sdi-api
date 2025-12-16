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

    // Mapeamento completo de caracteres Unicode para ISO8859_1 equivalentes
    const charMap: { [key: string]: string } = {
      // Aspas e pontuação especial
      '\u201c': '"', '\u201d': '"', // " "
      '\u2018': "'", '\u2019': "'", // ' '
      '\u2013': '-', '\u2014': '-', // – —
      '\u2026': '...', // …
      '\u2022': '*', '\u25e6': '-', // • ◦
      
      // Letras com diacríticos especiais não suportadas pelo ISO8859_1
      '\u0117': 'e', // ė (e com ponto) ← NOSSO PROBLEMA PRINCIPAL
      '\u0101': 'a', '\u0113': 'e', '\u012b': 'i', '\u014d': 'o', '\u016b': 'u', // macrons
      '\u010d': 'c', '\u0161': 's', '\u017e': 'z', // carons
      '\u0142': 'l', '\u0159': 'r', '\u010f': 'd', '\u0165': 't', '\u0148': 'n',
      '\u0111': 'd', '\u00f8': 'o', '\u00e6': 'ae', '\u0153': 'oe', // nórdicos
      '\u00df': 'ss', '\u00fe': 'th', '\u00f0': 'd', // germânicos
      
      // Símbolos monetários e comerciais
      '\u20ac': 'EUR', // €
      '\u00a3': 'GBP', // £
      '\u20b9': 'Rs',  // ₹
      '\u2122': '(TM)', '\u00ae': '(R)', '\u00a9': '(C)', // ™ ® ©
      '\u2116': 'No.', // №
      
      // Emojis mais comuns convertidos para texto
      '\ud83d\ude0a': ':)', '\ud83d\ude22': ':(', // 😊 😢
      '\ud83d\udc4d': '(ok)', '\ud83d\udc4e': '(no)', // 👍 👎
      '\u2764\ufe0f': '<3', '\ud83d\udd25': '(fire)', // ❤️ 🔥
      '\u2705': '[OK]', '\u274c': '[X]', // ✅ ❌
      '\u26a0\ufe0f': '(!!)', // ⚠️
      '\ud83d\udcde': 'tel:', '\ud83d\udce7': 'email:', // 📞 📧
      '\ud83d\ude9a': 'entrega', '\ud83d\udcb0': 'R$', // 🚚 💰
      
      // Outros símbolos problemáticos
      '\u2190': '<-', '\u2192': '->', // ← →
      '\u2191': '^', '\u2193': 'v', // ↑ ↓
      '\u2713': 'v', '\u2717': 'x', // ✓ ✗
      '\u25cf': '*', '\u25cb': 'o', // ● ○
      '\u2605': '*', '\u2606': '*', // ★ ☆
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