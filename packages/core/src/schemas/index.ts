// ::: tldr Zod schemas for runtime validation
import { z } from 'zod';

// ::: api Base schemas for reusability
const contextSchema = z.string()
  .min(1, 'Context cannot be empty')
  .max(50, 'Context too long')
  .regex(/^[a-zA-Z0-9_@:,\[\]-]+(\([^)]*\))?$/, 'Invalid context format');

const lineNumberSchema = z.number()
  .int('Line number must be an integer')
  .positive('Line number must be positive');

const columnNumberSchema = z.number()
  .int('Column number must be an integer')
  .positive('Column number must be positive');

// ::: api waymark schema
export const waymarkSchema = z.object({
  line: lineNumberSchema,
  column: columnNumberSchema,
  raw: z.string().min(1, 'Raw line cannot be empty'),
  contexts: z.array(contextSchema).min(1, 'At least one context required'),
  prose: z.string().optional(),
  file: z.string().optional(),
});

export type WaymarkValidated = z.infer<typeof waymarkSchema>;

// ::: api Parse Error schema
export const parseErrorSchema = z.object({
  line: lineNumberSchema,
  column: columnNumberSchema,
  message: z.string().min(1, 'Error message cannot be empty'),
  raw: z.string(),
});

export type ParseErrorValidated = z.infer<typeof parseErrorSchema>;

// ::: api Parse Result schema
export const parseResultSchema = z.object({
  anchors: z.array(waymarkSchema),
  errors: z.array(parseErrorSchema),
});

export type ParseResultValidated = z.infer<typeof parseResultSchema>;

// ::: api Search Options schema
export const searchOptionsSchema = z.object({
  contexts: z.array(contextSchema).optional(),
  files: z.array(z.string()).optional(),
  exclude: z.array(z.string()).optional(),
  context: z.number().int().nonnegative().optional(),
  recursive: z.boolean().optional(),
  respectGitignore: z.boolean().optional(),
});

export type SearchOptionsValidated = z.infer<typeof searchOptionsSchema>;

// ::: api output format options
export const outputFormatSchema = z.enum(['terminal', 'json', 'csv']);

// ::: api CLI command schemas
export const parseCommandOptionsSchema = z.object({
  json: z.boolean().optional(),
  verbose: z.boolean().optional(),
  format: outputFormatSchema.optional(),
});

export const searchCommandOptionsSchema = z.object({
  json: z.boolean().optional(),
  contextLines: z.string().regex(/^\d+$/, 'Context lines must be a number').optional(),
  format: outputFormatSchema.optional(),
  // Controls whether to respect .gitignore files during search
  // Default: true (respects .gitignore)
  // CLI flag --no-gitignore sets this to false
  gitignore: z.boolean().default(true),
});

export const listCommandOptionsSchema = z.object({
  json: z.boolean().optional(),
  contexts: z.boolean().optional(),
  format: outputFormatSchema.optional(),
  // Controls whether to respect .gitignore files during listing
  // Default: true (respects .gitignore)
  // CLI flag --no-gitignore sets this to false
  gitignore: z.boolean().default(true),
});

// ::: api File path validation
export const filePathSchema = z.string()
  .min(1, 'File path cannot be empty')
  .refine((path: string) => !path.includes('\0'), 'File path cannot contain null bytes');

// ::: api Anchor payload validation
export const anchorPayloadSchema = z.string()
  .min(1, 'Anchor payload cannot be empty')
  .refine((payload: string) => {
    // Must have at least one non-whitespace character
    return payload.trim().length > 0;
  }, 'Anchor payload must contain non-whitespace characters');

// ::: api Create validated parse input
export const parseInputSchema = z.object({
  content: z.string(),
  filename: filePathSchema.optional(),
});

export type ParseInputValidated = z.infer<typeof parseInputSchema>;