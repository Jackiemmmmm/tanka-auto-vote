const { resolve } = require('path');
const AtImport = require('postcss-import');
const precss = require('precss');
const autoprefixer = require('autoprefixer');

// Todo https://github.com/stylelint/stylelint https://github.com/morishitter/stylefmt
module.exports = {
  plugins: [
    AtImport({
      path: resolve('src'),
    }),
    precss,
    autoprefixer,
  ],
};
