const env = process.env.ENV || 'dev';

/* eslint-disable import/no-dynamic-require */
module.exports = require(`./${env}`);
/* eslint-enable import/no-dynamic-require */
