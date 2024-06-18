const baseConfig = require('./base.config');

const esmConfig = [
  ...baseConfig,
  {
    languageOptions: {
      sourceType: 'module',
    },
  },
];

module.exports = esmConfig;
