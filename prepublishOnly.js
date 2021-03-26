#!/usr/bin/env node
const execa = require('execa');

async function main() {
  await execa.command('npm i', { stdio: 'inherit' });
  await execa.command('npm test', { stdio: 'inherit' });
  await execa.command('npm run build', { stdio: 'inherit' });
  await execa.command('git status -s', { all: true }).then(({ all: status }) => {
    if (status.trim() !== '') {
      throw Error('Git working tree is dirty.');
    }
  });
}

main().catch((err) => {
  console.error(`${err}`);
  process.exitCode = 1;
});
