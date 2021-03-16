#!/usr/bin/env node
const execa = require('execa');

execa.command('git status -s', { all: true }).then((result) => {
  if (result.all.trim() !== '') {
    console.error('Git working tree is dirty.');
    process.exitCode = 1;
  }
});
