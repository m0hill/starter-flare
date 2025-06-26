/** biome-ignore-all lint/suspicious/noConsole: logger service */
import { data, isRouteErrorResponse } from 'react-router'
import { isDevelopment } from '@/app/constants/env'

const LogLevel = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
} as const

type LogLevel = (typeof LogLevel)[keyof typeof LogLevel]

class Logger {
  constructor(private level: LogLevel = LogLevel.INFO) {}

  private shouldLog(level: LogLevel): boolean {
    return isDevelopment && this.level >= level
  }

  private formatMessage(message: string, context?: string): string {
    return `[${context || 'APP'}] ${message}`
  }

  error(message: string, context?: string, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.formatMessage(message, context), ...args)
    }
  }

  warn(message: string, context?: string, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage(message, context), ...args)
    }
  }

  info(message: string, context?: string, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage(message, context), ...args)
    }
  }

  debug(message: string, context?: string, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(this.formatMessage(message, context), ...args)
    }
  }

  logError(error: unknown, context?: string): void {
    if (!this.shouldLog(LogLevel.ERROR)) {
      return
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    this.error(errorMessage, context, error)
  }
}

export const logger = new Logger(isDevelopment ? LogLevel.DEBUG : LogLevel.ERROR)

export function logError(error: unknown, context?: string): void {
  logger.logError(error, context)
}

export function handleServerError(
  error: unknown,
  context: string,
  userMessage = 'An unexpected error occurred'
) {
  logger.error('Server error occurred', context, {
    error: error instanceof Error ? error.message : error,
    stack: error instanceof Error ? error.stack : undefined,
    userMessage,
  })

  return data(
    {
      status: 'error',
      message: userMessage,
    },
    {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}

export function getErrorDetails(error: unknown) {
  const details = {
    message: 'An unexpected error occurred',
    status: 500,
    isRouteError: false,
  }

  if (isRouteErrorResponse(error)) {
    details.message = error.data?.message || error.data || 'An error occurred'
    details.status = error.status
    details.isRouteError = true
  } else if (error instanceof Error) {
    details.message = error.message
  }

  logger.debug('Error details extracted', 'ERROR_HANDLER', details)

  return details
}

export const log = {
  error: (message: string, context?: string, ...args: unknown[]) =>
    logger.error(message, context, ...args),
  warn: (message: string, context?: string, ...args: unknown[]) =>
    logger.warn(message, context, ...args),
  info: (message: string, context?: string, ...args: unknown[]) =>
    logger.info(message, context, ...args),
  debug: (message: string, context?: string, ...args: unknown[]) =>
    logger.debug(message, context, ...args),
}

export { LogLevel }
