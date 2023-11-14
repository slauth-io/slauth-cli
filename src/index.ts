#! /usr/bin/env node

import 'dotenv/config';
import { Command } from 'commander';
import scanCommand from './commands/scan';

const program = new Command();
program.name('slauth').addCommand(scanCommand).parseAsync(process.argv);
