#!/usr/bin/env node

import { Command } from 'commander';
import spawn from 'cross-spawn';
import path from 'node:path';

const start = ({ inspect }) => {
  spawn(
    'node',
    [inspect && '--inspect', path.join(process.cwd(), './dist/private/server.js')].filter(Boolean),
    { stdio: 'inherit' },
  );
};

const command = new Command().option('--inspect', 'add node inspect flag', false).action(start);

(async () => {
  await command.parseAsync(process.argv);
})();
