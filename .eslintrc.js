'use strict';
module.exports = {
  'env': {
    'es6' : true,
    'node': true,
  },
  'parser': 'babel-eslint',
  'plugins': [
    'flowtype',
  ],
  'extends': [
    'eslint:recommended',
    'plugin:flowtype/recommended',
  ],
  'rules'  : {
    'flowtype/no-types-missing-file-annotation': 0,
    'strict': [
      2,
      'global',
    ],
    'indent': [
      'error',
      2,
    ],
    'linebreak-style': [
      'error',
      'unix',
    ],
    'quotes': [
      'error',
      'single',
    ],
    'semi': [
      'error',
      'always',
    ],
    'comma-dangle': [
      'error',
      'always-multiline',
   ],
    'no-console': [
      'error', {
        'allow': [
          'log',
          'warn',
          'error'
        ]
      }
    ],
    'key-spacing': [
      'error',
      {
        'multiLine': {
          'beforeColon': false,
          'afterColon' : true,
        },
        'align': {
          'beforeColon': false,
          'afterColon' : true,
          'on'         : 'colon',
          'mode'       : 'strict',
        },
      },
    ],
    'no-var': [
      'error',
    ],
    'prefer-arrow-callback': [
      'error', {
        'allowNamedFunctions': true,
      },
    ],
    'prefer-const': [
      'error',
      {
        'destructuring'         : 'any',
        'ignoreReadBeforeAssign': false,
      },
    ],
  },
};
