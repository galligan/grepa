// :ga:tldr Configuration loading and validation using Zod schemas

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { z } from 'zod';
import { ConfigSchema, type Config } from './schema.js';

export class ConfigError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'ConfigError';
  }
}

export class ConfigLoader {
  private readonly cwd: string;
  private readonly defaultConfigPath: string;

  constructor(cwd: string = process.cwd()) {
    this.cwd = cwd;
    this.defaultConfigPath = join(cwd, '.grepa', 'inventory.config.json');
  }

  loadConfig(customPath?: string): Config {
    const configPath = customPath || this.defaultConfigPath;
    
    if (!existsSync(configPath)) {
      if (customPath) {
        throw new ConfigError(`Configuration file not found: ${configPath}`);
      }
      // Use defaults if no config file exists
      return ConfigSchema.parse({});
    }

    try {
      const content = readFileSync(configPath, 'utf8');
      const rawConfig = JSON.parse(content);
      return ConfigSchema.parse(rawConfig);
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new ConfigError(`Invalid JSON in config file: ${configPath}`, error);
      }
      
      if (error instanceof z.ZodError) {
        const messages = error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        ).join(', ');
        throw new ConfigError(`Invalid configuration: ${messages}`, error);
      }

      throw new ConfigError(
        `Failed to load configuration from ${configPath}: ${error instanceof Error ? error.message : String(error)}`,
        error
      );
    }
  }

  validateConfig(config: unknown): Config {
    try {
      return ConfigSchema.parse(config);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        ).join(', ');
        throw new ConfigError(`Invalid configuration: ${messages}`, error);
      }
      throw error;
    }
  }

  resolveIgnorePatterns(patterns: readonly string[], config: Config): string[] {
    const globs: string[] = [];
    const ignoreConfig = config.ignore;
    const patternDefs = ignoreConfig.patterns;

    for (const pattern of patterns) {
      if (patternDefs[pattern]) {
        // It's a predefined pattern alias
        const definition = patternDefs[pattern]!;
        if (definition.globs) {
          globs.push(...definition.globs);
        }
      } else {
        // It's a custom pattern
        globs.push(pattern);
      }
    }

    return globs;
  }

  getActivePatterns(config: Config): string[] {
    const patterns: string[] = [];
    const ignoreConfig = config.ignore;

    // Add active named patterns
    for (const [patternName, patternDef] of Object.entries(ignoreConfig.patterns)) {
      if (patternDef.active) {
        patterns.push(patternName);
      }
    }

    // Add custom patterns
    patterns.push(...ignoreConfig.custom);

    return patterns;
  }
}