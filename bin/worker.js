// enables ES6 support
require('babel-core/register');
require('babel-polyfill');

require(process.env.NODE_ENV === 'production' ? '../lib/worker' : '../src/worker').start(require('../config').default);
