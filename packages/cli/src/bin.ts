#!/usr/bin/env node
// ::: tldr CLI entry point for `waymark` command
import { CLI } from './index.js';

void (async () => {
  const cli = new CLI();
  await cli.run();
})();