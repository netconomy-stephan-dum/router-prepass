#!/usr/bin/env node

import path from 'node:path';
import { Command } from 'commander';
import spawn from 'cross-spawn';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { watch } from 'node:fs';
import { rm, mkdir } from 'node:fs/promises';

const require = createRequire(import.meta.url);
const __dirname = fileURLToPath(new URL('.', import.meta.url));

const dev = async ({ inspect }) => {
  const distPath = path.join(process.cwd(), 'dist');
  const serverDist = path.join(distPath, 'private');
  const browserDist = path.join(distPath, 'public');

  await rm(distPath, { force: true, recursive: true });
  await mkdir(serverDist, { recursive: true });
  await mkdir(browserDist, { recursive: true });

  const webpack = path.join(
    path.dirname(require.resolve('webpack/package.json')),
    'bin/webpack.js',
  );

  const commands = [
    [
      webpack,
      '-c',
      path.join(__dirname, '../webpack/server.js'),
      '--watch',
      '--mode',
      'development',
      // '--progress',
    ],
    [
      webpack,
      'serve',
      '-c',
      path.join(__dirname, '../webpack/devServer.js'),
      '-c',
      path.join(__dirname, '../webpack/browser.js'),
      '--mode',
      'development',
      // '--progress',
    ],
  ];

  const browserWatcher = watch(browserDist);
  const serverWatcher = watch(serverDist);

  let counter = 0;
  const setupHandler = () => {
    counter += 1;
    if (counter === 2) {
      browserWatcher.close();
      serverWatcher.close();

      spawn(
        'nodemon',
        [inspect && '--inspect', path.join(serverDist, 'server.js')].filter(Boolean),
        { stdio: 'inherit' },
      );
    }
  };

  browserWatcher.once('change', setupHandler);
  serverWatcher.once('change', setupHandler);

  commands.forEach((command) => {
    spawn('node', command, { stdio: 'inherit' });
  });
};
const program = new Command().option('--inspect', 'add node inspect flag', false).action(dev);

(async () => {
  await program.parseAsync(process.argv);
})();
