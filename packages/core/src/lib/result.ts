// ::: tldr Result pattern implementation for error handling
import type { AppError, ErrorCode } from './error.js';
import { makeError } from './error.js';

export type Result<T, E = AppError> =
  | { ok: true; data: T }
  | { ok: false; error: E };

export const success = <T>(data: T): Result<T, never> => ({ ok: true, data });
export const failure = <E = AppError>(error: E): Result<never, E> => ({ ok: false, error });

// ::: api Helper for async operations with error handling
export async function tryAsync<T>(
  fn: () => Promise<T>,
  defaultErrorCode: ErrorCode = 'unexpected'
): Promise<Result<T, AppError>> {
  try {
    const data = await fn();
    return success(data);
  } catch (cause) {
    if (isAppError(cause)) {
      return failure(cause);
    }
    const message = cause instanceof Error ? cause.message : String(cause);
    return failure(makeError(defaultErrorCode, message, cause));
  }
}

// ::: api Type guard for AppError
export function isAppError(error: unknown): error is AppError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    typeof (error as AppError).code === 'string' &&
    typeof (error as AppError).message === 'string'
  );
}