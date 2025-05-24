#!/usr/bin/env node

// :ga:tldr Main CLI entry point for grepa command

import { Command } from 'commander';
import { createListCommand } from './commands/list.js';

async function main(): Promise<void> {
  const program = new Command();

  program
    .name('grepa')
    .description('Grep-anchor tools for making codebases discoverable')
    .version('0.1.0');

  // Add commands
  program.addCommand(createListCommand());

  // Parse command line arguments
  await program.parseAsync(process.argv);
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
  process.exit(1);
});

// Run the CLI
main().catch((error) => {
  console.error('CLI error:', error.message);
  process.exit(1);
});