import { config } from 'dotenv'

config({
  path: '.env'
})

export const APP_ENV = process.env.APP_ENV || ''
export const APP_URI = process.env.APP_URI || ''
export const PORT = process.env.PORT || ''

export const POSTGRES_URL = process.env.POSTGRES_URL || ''

export const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY || ''
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || ''

export const AWS_S3_REGION = process.env.AWS_S3_REGION || 'us-east-2'
export const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || ''
export const S3_URL_EXPIRES_IN_SECONDS = 60 * 60 // 1 hour
export const AWS_S3_LOCAL_URL =
  process.env.AWS_S3_LOCAL_URL || 'http://s3.localhost:4566'

export const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
export const RESEND_EMAIL_FROM =
  process.env.RESEND_EMAIL_FROM || 'onboarding@resend.dev'

export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || ''
export const JWT_ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES || '24h'
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || ''
export const JWT_REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || '7d'

export const SENTRY_DSN = process.env.SENTRY_DSN || ''

export const IS_DEVELOPMENT = APP_ENV === 'development'
export const IS_PRODUCTION = APP_ENV === 'production'
