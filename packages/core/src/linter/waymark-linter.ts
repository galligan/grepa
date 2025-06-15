// ::: tldr Linter for waymark syntax validation and migration
import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { type Result, success, failure } from '../lib/result.js';
import { makeError } from '../lib/error.js';

export interface LintIssue {
  line: number;
  column: number;
  type: 'error' | 'warning' | 'info';
  message: string;
  raw: string;
  fix?: {
    old: string;
    new: string;
  };
}

export interface LintResult {
  file: string;
  issues: LintIssue[];
  fixedCount?: number;
}

/**
 * Linter for waymark syntax validation and migration.
 * Supports both validation and auto-fixing of waymark syntax issues.
 */
export class WaymarkLinter {
  // ::: api lint configuration constants
  private static readonly OLD_SIGIL = ':M:';
  private static readonly NEW_SIGIL = ':::';

  /**
   * Lint a file for waymark syntax issues.
   * @param file - The file path to lint
   * @param autoFix - Whether to auto-fix issues
   * @returns Result containing lint issues or error
   */
  // ::: api main linting method
  static async lintFile(file: string, autoFix = false): Promise<Result<LintResult>> {
    // ::: ctx check file exists
    if (!existsSync(file)) {
      return failure(makeError(
        'file.notFound',
        `File not found: ${file}`
      ));
    }

    // ::: ctx read file content
    let content: string;
    try {
      content = await readFile(file, 'utf-8');
    } catch (error) {
      return failure(makeError(
        'file.readError',
        `Cannot read file ${file}: ${error instanceof Error ? error.message : 'Unknown error'}`
      ));
    }

    // ::: ctx lint the content
    const lintResult = WaymarkLinter.lintContent(content, file);
    
    if (autoFix && lintResult.issues.length > 0) {
      // ::: ctx apply fixes
      const fixResult = WaymarkLinter.applyFixes(content, lintResult.issues);
      if (fixResult.fixed) {
        try {
          await writeFile(file, fixResult.content, 'utf-8');
          return success({
            file,
            issues: lintResult.issues,
            fixedCount: fixResult.fixedCount
          });
        } catch (error) {
          return failure(makeError(
            'file.readError',
            `Cannot write file ${file}: ${error instanceof Error ? error.message : 'Unknown error'}`
          ));
        }
      }
    }

    return success({
      file,
      issues: lintResult.issues
    });
  }

  /**
   * Lint content for waymark syntax issues.
   * @param content - The content to lint
   * @param filename - Optional filename for context
   * @returns Lint result with issues found
   */
  // ::: api lint content without file I/O
  static lintContent(content: string, filename?: string): LintResult {
    const issues: LintIssue[] = [];
    const lines = content.split('\n');

    lines.forEach((line, lineIndex) => {
      const lineNumber = lineIndex + 1;

      // ::: ctx check for old :M: sigil
      const oldSigilIndex = line.indexOf(WaymarkLinter.OLD_SIGIL);
      if (oldSigilIndex !== -1) {
        issues.push({
          line: lineNumber,
          column: oldSigilIndex + 1,
          type: 'error',
          message: `Old sigil "${WaymarkLinter.OLD_SIGIL}" found. Use "${WaymarkLinter.NEW_SIGIL}" instead.`,
          raw: line,
          fix: {
            old: WaymarkLinter.OLD_SIGIL,
            new: WaymarkLinter.NEW_SIGIL
          }
        });
      }

      // ::: ctx check for new ::: sigil and validate syntax
      const newSigilIndex = line.indexOf(WaymarkLinter.NEW_SIGIL);
      if (newSigilIndex !== -1) {
        // ::: ctx validate space after sigil
        const afterSigil = line.substring(newSigilIndex + 3);
        if (!afterSigil.startsWith(' ')) {
          issues.push({
            line: lineNumber,
            column: newSigilIndex + 4,
            type: 'error',
            message: `Missing required space after "${WaymarkLinter.NEW_SIGIL}"`,
            raw: line
          });
        } else {
          // ::: ctx validate payload not empty
          const payload = afterSigil.substring(1).trim();
          if (!payload) {
            issues.push({
              line: lineNumber,
              column: newSigilIndex + 5,
              type: 'error',
              message: 'Empty waymark payload',
              raw: line
            });
          }
        }
      }
    });

    return {
      file: filename || '<input>',
      issues
    };
  }

  /**
   * Apply fixes to content based on lint issues.
   * @param content - The original content
   * @param issues - The lint issues with fixes
   * @returns Fixed content and count of fixes applied
   */
  // ::: api apply auto-fixes to content
  static applyFixes(content: string, issues: LintIssue[]): { content: string; fixed: boolean; fixedCount: number } {
    let fixedContent = content;
    let fixedCount = 0;

    // ::: ctx sort issues by line and column in reverse order to avoid offset issues
    const sortedIssues = [...issues]
      .filter(issue => issue.fix)
      .sort((a, b) => {
        if (a.line === b.line) {
          return b.column - a.column;
        }
        return b.line - a.line;
      });

    // ::: ctx apply fixes
    const lines = fixedContent.split('\n');
    for (const issue of sortedIssues) {
      if (issue.fix && issue.line <= lines.length) {
        const lineIndex = issue.line - 1;
        const line = lines[lineIndex];
        if (line) {
          const newLine = line.replace(issue.fix.old, issue.fix.new);
          if (newLine !== line) {
            lines[lineIndex] = newLine;
            fixedCount++;
          }
        }
      }
    }

    fixedContent = lines.join('\n');
    return {
      content: fixedContent,
      fixed: fixedCount > 0,
      fixedCount
    };
  }

  /**
   * Migrate old waymark syntax to new syntax in a file.
   * @param file - The file path to migrate
   * @returns Result containing migration result or error
   */
  // ::: api convenience method for migration
  static async migrateFile(file: string): Promise<Result<LintResult>> {
    return WaymarkLinter.lintFile(file, true);
  }

  /**
   * Check if content uses old sigil.
   * @param content - The content to check
   * @returns True if old sigil is found
   */
  // ::: api check for old sigil presence
  static hasOldSigil(content: string): boolean {
    return content.includes(WaymarkLinter.OLD_SIGIL);
  }

  /**
   * Count waymarks in content.
   * @param content - The content to analyze
   * @returns Count of old and new waymarks
   */
  // ::: api count waymarks by type
  static countWaymarks(content: string): { old: number; new: number } {
    const oldCount = (content.match(/:M:/g) || []).length;
    const newCount = (content.match(/:::/g) || []).length;
    return { old: oldCount, new: newCount };
  }
}