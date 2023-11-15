#! /usr/bin/env node

import 'dotenv/config';
import { Command } from 'commander';
import scanCommand from './commands/scan';
import { coloredLogo } from './utils/print-ascii-logo';

const program = new Command();
program
  .name('slauth')
  .addCommand(scanCommand)
  .addHelpText(`beforeAll`, coloredLogo)
  .parseAsync(process.argv);
