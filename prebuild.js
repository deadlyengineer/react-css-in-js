#!/usr/bin/env node
const { version } = require('./package.json');
const {
  total: { statements, branches, functions, lines },
} = require('./coverage/coverage-summary.json');
const fs = require('fs');
const path = require('path');

const readmeFilename = path.join(__dirname, 'README.md');

let readmeText = fs.readFileSync(readmeFilename, 'utf-8');
readmeText = readmeText.replace(/(react-css-in-js@|badge\/npm\/)[a-z0-9.-]+/g, `$1${version}`);
readmeText = readmeText.replace(
  /(badge\/coverage\/)[\d,]+/,
  `$1${Math.floor(statements.pct)},${Math.floor(branches.pct)},${Math.floor(functions.pct)},${Math.floor(lines.pct)}`
);

fs.writeFileSync(readmeFilename, readmeText);
