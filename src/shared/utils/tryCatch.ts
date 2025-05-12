import { inspect } from 'util'

export type Success<T> = {
  readonly type: 'success'
  readonly data: T
  readonly error?: never
}

export type Failure<E> = {
  readonly type: 'failure'
  readonly data?: never
  readonly error: E
}

export type Result<T, E = ErrorInfo> = Success<T> | Failure<E>

export type ErrorInfo = {
  readonly message: string
  readonly code?: string
  readonly stack?: string
  readonly cause?: unknown
}

export const isSuccess = <T, E>(result: Result<T, E>): result is Success<T> => {
  return result.type === 'success'
}

export const isFailure = <T, E>(result: Result<T, E>): result is Failure<E> => {
  return result.type === 'failure'
}

export const createErrorInfo = (error: unknown): ErrorInfo => {
  if (error instanceof Error) {
    const baseInfo: ErrorInfo = {
      message: error.message,
      stack: error.stack,
      cause: 'cause' in error ? error.cause : undefined,
    }
    return baseInfo
  }

  let message: string
  try {
    message = String(error)
  } catch {
    message = inspect(error)
  }

  return {
    message: message,
    cause: error,
  }
}

export const success = <T>(data: T): Success<T> => {
  return { type: 'success', data }
}

export const failure = <E>(error: E): Failure<E> => {
  return { type: 'failure', error }
}

export function tryCatch<T>(promiseFn: () => Promise<T>): Promise<Result<T, ErrorInfo>>
export function tryCatch<T, E>(
  promiseFn: () => Promise<T>,
  mapErrorFn: (caughtError: unknown) => E
): Promise<Result<T, E>>
export async function tryCatch<T, E = ErrorInfo>(
  promiseFn: () => Promise<T>,
  mapErrorFn?: (caughtError: unknown) => E
): Promise<Result<T, E>> {
  try {
    const data = await promiseFn()
    return success(data)
  } catch (error) {
    const errorHandler = mapErrorFn ?? (createErrorInfo as (caughtError: unknown) => E)
    return failure(errorHandler(error))
  }
}

export function tryCatchSync<T>(fn: () => T): Result<T, ErrorInfo>

export function tryCatchSync<T, E>(
  fn: () => T,
  mapErrorFn: (caughtError: unknown) => E
): Result<T, E>
export function tryCatchSync<T, E = ErrorInfo>(
  fn: () => T,
  mapErrorFn?: (caughtError: unknown) => E
): Result<T, E> {
  try {
    const data = fn()
    return success(data)
  } catch (error) {
    const errorHandler = mapErrorFn ?? (createErrorInfo as (caughtError: unknown) => E)
    return failure(errorHandler(error))
  }
}

export function map<T, U>(result: Result<T, ErrorInfo>, fn: (data: T) => U): Result<U, ErrorInfo>

export function map<T, U, E>(
  result: Result<T, E>,
  fn: (data: T) => U,
  mapErrorFn: (caughtError: unknown) => E
): Result<U, E>
export function map<T, U, E = ErrorInfo>(
  result: Result<T, E>,
  fn: (data: T) => U,
  mapErrorFn?: (caughtError: unknown) => E
): Result<U, E> {
  if (isSuccess(result)) {
    try {
      return success(fn(result.data))
    } catch (error) {
      const errorHandler = mapErrorFn ?? (createErrorInfo as (caughtError: unknown) => E)
      return failure(errorHandler(error))
    }
  }
  return result as Result<U, E>
}

export function andThen<T, U>(
  result: Result<T, ErrorInfo>,
  fn: (data: T) => Promise<Result<U, ErrorInfo>> | Result<U, ErrorInfo>
): Promise<Result<U, ErrorInfo>>
export function andThen<T, U, E>(
  result: Result<T, E>,
  fn: (data: T) => Promise<Result<U, E>> | Result<U, E>,
  mapErrorFn: (caughtError: unknown) => E
): Promise<Result<U, E>>
export async function andThen<T, U, E = ErrorInfo>(
  result: Result<T, E>,
  fn: (data: T) => Promise<Result<U, E>> | Result<U, E>,
  mapErrorFn?: (caughtError: unknown) => E
): Promise<Result<U, E>> {
  if (isSuccess(result)) {
    try {
      const nextResult = await fn(result.data)
      return nextResult
    } catch (error) {
      const errorHandler = mapErrorFn ?? (createErrorInfo as (caughtError: unknown) => E)
      return failure(errorHandler(error))
    }
  }
  return result as Result<U, E>
}

export function andThenSync<T, U>(
  result: Result<T, ErrorInfo>,
  fn: (data: T) => Result<U, ErrorInfo>
): Result<U, ErrorInfo>
export function andThenSync<T, U, E>(
  result: Result<T, E>,
  fn: (data: T) => Result<U, E>,
  mapErrorFn: (caughtError: unknown) => E
): Result<U, E>
export function andThenSync<T, U, E = ErrorInfo>(
  result: Result<T, E>,
  fn: (data: T) => Result<U, E>,
  mapErrorFn?: (caughtError: unknown) => E
): Result<U, E> {
  if (isSuccess(result)) {
    try {
      return fn(result.data)
    } catch (error) {
      const errorHandler = mapErrorFn ?? (createErrorInfo as (caughtError: unknown) => E)
      return failure(errorHandler(error))
    }
  }
  return result as Result<U, E>
}

export const mapError = <T, E, F>(result: Result<T, E>, fn: (error: E) => F): Result<T, F> => {
  if (isFailure(result)) {
    try {
      return failure(fn(result.error))
    } catch (caughtError) {
      console.error("Error occurred within mapError's mapping function:", caughtError)
      throw caughtError
    }
  }

  return result as Result<T, F>
}

export const getOrElse = <T, E>(result: Result<T, E>, defaultValue: T): T => {
  if (isSuccess(result)) {
    return result.data
  }
  return defaultValue
}

export const getOrElseL = <T, E>(result: Result<T, E>, defaultValueFn: (error: E) => T): T => {
  if (isSuccess(result)) {
    return result.data
  }
  return defaultValueFn(result.error)
}

export const match = <T, E, U>(
  result: Result<T, E>,
  onSuccess: (data: T) => U,
  onFailure: (error: E) => U
): U => {
  if (isSuccess(result)) {
    return onSuccess(result.data)
  }
  return onFailure(result.error)
}
