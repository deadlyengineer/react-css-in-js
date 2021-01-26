#!/usr/bin/env node
const { version } = require('./package.json');
const fs = require('fs');
const path = require('path');

const readmeFilename = path.join(__dirname, 'README.md');
const readmeText = fs.readFileSync(readmeFilename);

fs.writeFileSync(readmeFilename, readmeText.replace(/(react-css-in-js@)[a-z0-9.]+/g, `$1${version}`));
