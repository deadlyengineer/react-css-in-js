#!/usr/bin/env node
const { version } = require('./package.json');
const execa = require('execa');

execa.commandSync(`git add .`, { stdio: 'inherit' });
execa.commandSync(`git commit -m v${version}`, { stdio: 'inherit' });
execa.commandSync(`git tag v${version}`, { stdio: 'inherit' });
execa.commandSync(`git push --follow-tags`);
