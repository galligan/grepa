// ::: tldr Error handling types following TypeScript conventions

export type ErrorCode =
  // Parse errors
  | 'parse.invalidSyntax'     // Invalid waymark syntax
  | 'parse.missingSpace'      // Missing space after :::
  | 'parse.emptyPayload'      // Empty anchor payload
  | 'parse.invalidContext'    // Invalid context format
  | 'parse.tooManyContexts'   // Too many contexts on one line

  // File errors
  | 'file.notFound'           // File doesn't exist
  | 'file.readError'          // Can't read file
  | 'file.accessDenied'       // Permission denied
  | 'file.tooLarge'           // File exceeds size limit
  | 'file.invalidPath'        // Invalid file path
  | 'file.unsupportedType'    // Unsupported file type

  // Search errors
  | 'search.noResults'        // No results found
  | 'search.invalidPattern'   // Invalid search pattern
  | 'search.tooManyResults'   // Too many results

  // CLI errors
  | 'cli.invalidCommand'      // Invalid CLI command
  | 'cli.missingArgument'     // Missing required argument
  | 'cli.invalidOption'       // Invalid command option

  // Security errors
  | 'security.rateLimitExceeded'  // Rate limit exceeded
  | 'security.maliciousContent'   // Malicious content detected
  | 'security.contentTooLarge'    // Content too large for security

  // Validation errors
  | 'validation'              // Generic validation error
  | 'validation.schema'       // Schema validation failed
  | 'validation.type'         // Type validation failed

  // System errors
  | 'system.outOfMemory'      // Out of memory
  | 'system.timeout'          // Operation timed out
  | 'network'                 // Network error
  | 'unexpected'              // Unhandled exception

  // Lint errors
  | 'lint.hasIssues';         // Linting found issues

export interface AppError {
  code: ErrorCode;
  message: string;
  statusCode?: number;
  cause?: unknown;
}
export const makeError = (
  code: ErrorCode,
  message: string,
  cause?: unknown,
): AppError => ({
  code,
  message,
  statusCode: getStatusCode(code),
  cause,
});

// ::: api Maps ErrorCodes to appropriate status codes
function getStatusCode(code: ErrorCode): number {
  const mapping: Record<ErrorCode, number> = {
    // Parse errors - 400 Bad Request
    'parse.invalidSyntax': 400,
    'parse.missingSpace': 400,
    'parse.emptyPayload': 400,
    'parse.invalidContext': 400,
    'parse.tooManyContexts': 400,

    // File errors
    'file.notFound': 404,
    'file.readError': 500,
    'file.accessDenied': 403,
    'file.tooLarge': 413,
    'file.invalidPath': 400,
    'file.unsupportedType': 415,

    // Search errors
    'search.noResults': 404,
    'search.invalidPattern': 400,
    'search.tooManyResults': 413,

    // CLI errors
    'cli.invalidCommand': 400,
    'cli.missingArgument': 400,
    'cli.invalidOption': 400,

    // Security errors
    'security.rateLimitExceeded': 429,
    'security.maliciousContent': 400,
    'security.contentTooLarge': 413,

    // Validation errors
    'validation': 400,
    'validation.schema': 400,
    'validation.type': 400,

    // System errors
    'system.outOfMemory': 507,
    'system.timeout': 408,
    'network': 503,
    'unexpected': 500,

    // Lint errors
    'lint.hasIssues': 400,
  };
  return mapping[code] ?? 500;
}