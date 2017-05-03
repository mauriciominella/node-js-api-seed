#!/usr/bin/env node

// enables ES6 support
require('babel-core/register');
require('babel-polyfill');

const spawn = require('child_process').spawn;
const config = require('../config/env').default;

const waitforit = spawn('bash', ['./scripts/wait-for-it.sh', `--host=${config.mongo.host}`, `--port=${config.mongo.port}`, '--timeout=20']);

const getLogInfo = () => {
  return `[${new Date().toISOString()}] [INFO]`;
};

const getLogError = () => {
  return `[${new Date().toISOString()}] [ERROR]`;
};

waitforit.stdout.on('data', (data) => {
  console.log(getLogInfo(), data.toString()); // eslint-disable-line
});


waitforit.stderr.on('data', (data) => {
  console.log(getLogInfo(), data.toString()); // eslint-disable-line
});


waitforit.on('error', (code) => {
  console.log(getLogError(), code); // eslint-disable-line
  /* eslint no-process-exit:0 */
  process.exit(code);
});


waitforit.on('close', (code) => {
  console.log(getLogInfo(), 'done', code); // eslint-disable-line
  /* eslint no-process-exit:0 */
  process.exit(code);
});
