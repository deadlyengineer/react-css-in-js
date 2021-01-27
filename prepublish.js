#!/usr/bin/env node
const { version } = require('./package.json');
const {
  total: { branches, functions, lines, statements },
} = require('./coverage/coverage-summary.json');
const fs = require('fs');
const path = require('path');
const execa = require('execa');

const readmeFilename = path.join(__dirname, 'README.md');

let readmeText = fs.readFileSync(readmeFilename, 'utf-8');
readmeText = readmeText.replace(/(react-css-in-js@|badge\/npm\/)[a-z0-9.-]+/g, `$1${version}`);
readmeText = readmeText.replace(/(badge\/coverage:branches\/)\d+%/, `$1${Math.floor(branches.pct)}%`);
readmeText = readmeText.replace(/(badge\/coverage:functions\/)\d+%/, `$1${Math.floor(functions.pct)}%`);
readmeText = readmeText.replace(/(badge\/coverage:lines\/)\d+%/, `$1${Math.floor(lines.pct)}%`);
readmeText = readmeText.replace(/(badge\/coverage:statements\/)\d+%/, `$1${Math.floor(statements.pct)}%`);

fs.writeFileSync(readmeFilename, readmeText);
execa.commandSync(`git add .`, { stdio: 'inherit' });
execa.commandSync(`git commit -m v${version}`, { stdio: 'inherit' });
execa.commandSync(`git tag v${version}`, { stdio: 'inherit' });
