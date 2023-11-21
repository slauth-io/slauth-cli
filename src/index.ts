#! /usr/bin/env node

import 'dotenv/config';
import { Command } from 'commander';
import scanCommand from './commands/scan';
import { coloredLogo } from './utils/print-ascii-logo';
import version from './version';

const program = new Command();
program
  .name('slauth')
  .addCommand(scanCommand)
  .addHelpText(`beforeAll`, coloredLogo)
  .version(version)
  .parseAsync(process.argv);

// Exports
export { default as Prompts } from './utils/prompts';
export { default as JSONSchemas } from './utils/json-schemas';
export * as ZodSchemas from './types/zod-aws-policy';
