// :ga:tldr Zod schemas for configuration validation

import { z } from 'zod';

export const PatternDefinitionSchema = z.object({
  globs: z.array(z.string()).optional(),
  active: z.boolean().default(false),
});

export const IgnoreConfigSchema = z.object({
  respectGitignore: z.boolean().default(true),
  patterns: z.record(z.string(), PatternDefinitionSchema).default({}),
  custom: z.array(z.string()).default([]),
});

export const DocsExamplesConfigSchema = z.object({
  ignore: z.boolean().default(false),
  include: z.array(z.string()).default([]),
  exclude: z.array(z.string()).default([
    'codeFences',
    'codeBlocks', 
    'headings',
    'inlineCode',
    'links',
    'blockquotes'
  ]),
});

export const OutputConfigSchema = z.object({
  file: z.string().default('.grepa/inventory.generated.json'),
  indent: z.number().min(0).max(8).default(2),
});

export const DisplayConfigSchema = z.object({
  showSummary: z.boolean().default(true),
  topTagsCount: z.number().min(1).max(20).default(5),
});

export const ConfigSchema = z.object({
  anchor: z.string().default(':ga:'),
  ignore: IgnoreConfigSchema.default({}),
  docsExamples: DocsExamplesConfigSchema.default({}),
  output: OutputConfigSchema.default({}),
  display: DisplayConfigSchema.default({}),
});

export type Config = z.infer<typeof ConfigSchema>;
export type IgnoreConfig = z.infer<typeof IgnoreConfigSchema>;
export type DocsExamplesConfig = z.infer<typeof DocsExamplesConfigSchema>;
export type OutputConfig = z.infer<typeof OutputConfigSchema>;
export type DisplayConfig = z.infer<typeof DisplayConfigSchema>;