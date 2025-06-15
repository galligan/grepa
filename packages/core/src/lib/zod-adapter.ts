// ::: tldr Zod error adapter following TypeScript conventions
import { ZodError } from 'zod';
import { makeError } from './error.js';
import type { AppError } from './error.js';

// ::: api Convert Zod errors to AppError
export const fromZod = (err: ZodError): AppError => {
  const issue = err.errors[0];
  if (!issue) {
    return makeError('validation', 'Validation failed', err);
  }
  
  const field = issue.path.join('.');
  const defaultMessage = `${field ? `${field}: ` : ''}${issue.message}`;

  // ::: ctx Map specific Zod issues to domain error codes
  if (field === 'file' && issue.code === 'custom') {
    return makeError('file.notFound', issue.message || 'File not found', err);
  }

  if (field.includes('marker') && issue.code === 'too_small') {
    return makeError('parse.emptyPayload', 'Marker cannot be empty', err);
  }

  if (field.includes('marker') && issue.code === 'invalid_string') {
    return makeError('parse.invalidSyntax', 'Invalid marker format', err);
  }

  return makeError('validation', defaultMessage, err);
};