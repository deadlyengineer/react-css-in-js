#!/usr/bin/env node
const { version } = require('./package.json');
const fs = require('fs');
const path = require('path');
const execa = require('execa');

const readmeFilename = path.join(__dirname, 'README.md');
const readmeText = fs.readFileSync(readmeFilename, 'utf-8');

fs.writeFileSync(readmeFilename, readmeText.replace(/(react-css-in-js@)[a-z0-9.-]+/g, `$1${version}`));
execa.commandSync(`git add .`, { stdio: 'inherit' });
execa.commandSync(`git commit -m v${version}`, { stdio: 'inherit' });
execa.commandSync(`git tag v${version}`, { stdio: 'inherit' });
