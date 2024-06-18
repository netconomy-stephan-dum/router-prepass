#!/usr/bin/env node

import { Command } from 'commander';
import path from 'node:path';
import spawn from 'cross-spawn';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { rm } from 'node:fs/promises';

const require = createRequire(import.meta.url);
const __dirname = fileURLToPath(new URL('.', import.meta.url));

const build = async () => {
  const distPath = path.join(process.cwd(), 'dist');
  await rm(distPath, { force: true, recursive: true });

  const webpack = path.join(
    path.dirname(require.resolve('webpack/package.json')),
    'bin/webpack.js',
  );

  const commands = [
    [
      webpack,
      '-c',
      path.join(__dirname, '../webpack/server.js'),
      '--mode',
      'production',
      '--progress',
    ],
    [
      webpack,
      '-c',
      path.join(__dirname, '../webpack/browser.js'),
      '--mode',
      'production',
      '--progress',
    ],
  ];

  commands.forEach((command) => {
    spawn('node', command, { stdio: 'inherit' });
  });
};
const program = new Command().action(build);

(async () => {
  await program.parseAsync(process.argv);
})();
