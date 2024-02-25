module.exports = {
    parser: 'typescript-eslint-parser',
    env: {
      browser: true,
      es6: true,
    },
    extends: 'airbnb-base',
    globals: {
      Atomics: 'readonly',
      SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
    },
    rules: {
        //import/extensions起的作用
        'import/extensions': [
            2, // 0 = off, 1 = warn, 2 = error
            'ignorePackages',
            {
            ts: 'never',
            },
        ],
    },
    settings: {
    //import/resolver起的作用
      'import/resolver': {
        alias: {
          map: [
            ['@', './src'],
          ],
          extensions: ['.ts'],
        },
      },
    },
  };