module.exports = {
  root: true,
  env:  {
    browser: false,
    node:    true
  },
  parserOptions: {
    sourceType:  'module',
    ecmaVersion: 2018
  },
  parser:  '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'align-import', 'jsdoc'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended'
  ],
  rules: {
    'align-import/align-import':         'off',
    'align-import/trim-import':          'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'never'
    ],
    'no-useless-escape': [
      'off'
    ],
    'no-console': [
      'off'
    ],
    'accessor-pairs':        'error',
    'array-bracket-newline': 'off',
    'array-bracket-spacing': [
      'off',
      'never'
    ],
    'array-callback-return': 'error',
    'arrow-body-style':      'off',
    'arrow-parens':          'off',
    'arrow-spacing':         [
      'error',
      {
        'after':  true,
        'before': true
      }
    ],
    'block-scoped-var':       'error',
    'block-spacing':          'error',
    'brace-style':            'off',
    'callback-return':        'error',
    'camelcase':              'off',
    'capitalized-comments':   'off',
    'class-methods-use-this': 'off',
    'comma-dangle':           ['error', 'only-multiline'],
    'comma-spacing':          [
      'error',
      {
        'after':  true,
        'before': false
      }
    ],
    'comma-style': [
      'error',
      'last'
    ],
    'complexity':                'off',
    'computed-property-spacing': [
      'error',
      'never'
    ],
    'consistent-this': 'off',
    'curly':           'off',
    'default-case':    'error',
    'dot-location':    [
      'error',
      'property'
    ],
    'dot-notation': [
      'error',
      {
        'allowKeywords': true
      }
    ],
    'eol-last':           'off',
    'eqeqeq':             'error',
    'for-direction':      'error',
    'func-call-spacing':  'error',
    'func-name-matching': 'error',
    'func-names':         [
      'error',
      'never'
    ],
    'func-style':               'off',
    'function-paren-newline':   'error',
    'generator-star-spacing':   'error',
    'getter-return':            'error',
    'global-require':           'off',
    'guard-for-in':             'off',
    'handle-callback-err':      'error',
    'id-blacklist':             'error',
    'id-length':                'off',
    'id-match':                 'error',
    'implicit-arrow-linebreak': [
      'error',
      'beside'
    ],
    'init-declarations':                'off',
    'jsx-quotes':                       'error',
    'key-spacing':                      'off',
    'keyword-spacing':                  'off',
    'line-comment-position':            'off',
    'lines-around-comment':             'error',
    'lines-around-directive':           'error',
    'max-depth':                        'off',
    'max-len':                          'off',
    'max-lines':                        'off',
    'max-nested-callbacks':             'error',
    'max-statements':                   'off',
    'max-statements-per-line':          'off',
    'multiline-comment-style':          'off',
    'new-parens':                       'error',
    'newline-after-var':                'off',
    'newline-before-return':            'off',
    'newline-per-chained-call':         ['error', { 'ignoreChainWithDepth': 3 }],
    'no-alert':                         'error',
    'no-array-constructor':             'error',
    'no-await-in-loop':                 'off',
    'no-bitwise':                       'error',
    'no-buffer-constructor':            'error',
    'no-caller':                        'error',
    'no-catch-shadow':                  'error',
    'no-confusing-arrow':               'off',
    'no-continue':                      'off',
    'no-div-regex':                     'error',
    'no-duplicate-imports':             'error',
    'no-else-return':                   'error',
    'no-empty-function':                'off',
    'no-eq-null':                       'error',
    'no-eval':                          'error',
    'no-extend-native':                 'error',
    'no-extra-bind':                    'error',
    'no-extra-label':                   'error',
    'no-extra-parens':                  'off',
    'no-floating-decimal':              'error',
    'no-implicit-coercion':             'off',
    'no-implicit-globals':              'error',
    'no-implied-eval':                  'error',
    'no-inline-comments':               'off',
    'no-invalid-this':                  'off',
    'no-iterator':                      'error',
    'no-label-var':                     'error',
    'no-labels':                        'error',
    'no-lone-blocks':                   'error',
    'no-lonely-if':                     'error',
    'no-loop-func':                     'off',
    'no-mixed-operators':               'error',
    'no-mixed-requires':                'error',
    'no-multi-assign':                  'error',
    'no-multi-spaces':                  'off',
    'no-multi-str':                     'error',
    'no-multiple-empty-lines':          'error',
    'no-native-reassign':               'error',
    'no-negated-in-lhs':                'error',
    'no-nested-ternary':                'error',
    'no-new':                           'error',
    'no-new-func':                      'error',
    'no-new-object':                    'error',
    'no-new-require':                   'error',
    'no-new-wrappers':                  'error',
    'no-octal-escape':                  'error',
    'no-param-reassign':                'error',
    'no-path-concat':                   'error',
    'no-plusplus':                      'off',
    'no-process-exit':                  'off',
    'no-process-env':                   'off',
    'no-proto':                         'error',
    'no-prototype-builtins':            'error',
    'no-restricted-globals':            'error',
    'no-restricted-imports':            'error',
    'no-restricted-modules':            'error',
    'no-restricted-properties':         'error',
    'no-restricted-syntax':             'error',
    'no-return-assign':                 'off',
    'no-return-await':                  'error',
    'no-script-url':                    'error',
    'no-self-compare':                  'error',
    'no-sequences':                     'error',
    'no-shadow':                        'error',
    'no-shadow-restricted-names':       'error',
    'no-spaced-func':                   'error',
    'no-tabs':                          'off',
    'no-template-curly-in-string':      'error',
    'no-trailing-spaces':               'off',
    'no-undef-init':                    'error',
    'no-undefined':                     'off',
    'no-unmodified-loop-condition':     'error',
    'no-unneeded-ternary':              'error',
    'no-unused-expressions':            'warn',
    'no-unused-vars':                   'warn',
    'no-use-before-define':             'off',
    'no-useless-call':                  'error',
    'no-useless-computed-key':          'error',
    'no-useless-concat':                'error',
    'no-useless-constructor':           'off',
    'no-useless-rename':                'error',
    'no-useless-return':                'off',
    'no-var':                           'error',
    'no-void':                          'error',
    'no-whitespace-before-property':    'error',
    'no-with':                          'error',
    'nonblock-statement-body-position': [
      'error',
      'any'
    ],
    'object-curly-newline':            'off',
    'object-curly-spacing':            'off',
    'object-shorthand':                'off',
    'one-var':                         'off',
    'one-var-declaration-per-line':    'error',
    'operator-assignment':             'error',
    'operator-linebreak':              'error',
    'padded-blocks':                   'off',
    'padding-line-between-statements': 'error',
    'prefer-arrow-callback':           'off',
    'prefer-const':                    'off',
    'prefer-destructuring':            'off',
    'prefer-numeric-literals':         'error',
    'prefer-promise-reject-errors':    [
      'error',
      {
        'allowEmptyReject': true
      }
    ],
    'prefer-rest-params':                               'off',
    'prefer-spread':                                    'error',
    'prefer-template':                                  'off',
    'lines-between-class-members':                      'off',
    '@typescript-eslint/no-var-requires':               'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any':               'off',
    '@typescript-eslint/camelcase':                     'off',
    '@typescript-eslint/ban-ts-ignore':                 'off',
    '@typescript-eslint/ban-ts-comment':                'off',
    '@typescript-eslint/interface-name-prefix':         'off',
    '@typescript-eslint/no-useless-constructor':        'error',
    '@typescript-eslint/no-misused-new':                'off',
    '@typescript-eslint/no-namespace':                  'off',
    'jsdoc/check-line-alignment':                       ['error', 'always'],
    'quote-props':                                      'off',
    'radix':                                            'error',
    'require-await':                                    'off',
    'require-atomic-updates':                           'off',
    'require-jsdoc':                                    'off',
    'rest-spread-spacing':                              'error',
    'semi-spacing':                                     'error',
    'semi-style':                                       [
      'error',
      'last'
    ],
    'sort-imports':                'off',
    'sort-keys':                   'off',
    'sort-vars':                   'error',
    'space-before-blocks':         'off',
    'space-before-function-paren': 'off',
    'space-in-parens':             'off',
    'space-infix-ops':             'error',
    'space-unary-ops':             'error',
    'spaced-comment':              'off',
    'switch-colon-spacing':        'error',
    'symbol-description':          'error',
    'template-curly-spacing':      'error',
    'template-tag-spacing':        'error',
    'unicode-bom':                 [
      'error',
      'never'
    ],
    'valid-jsdoc':        'error',
    'vars-on-top':        'error',
    'wrap-iife':          'error',
    'wrap-regex':         'error',
    'yield-star-spacing': 'error',
    'yoda':               [
      'error',
      'never'
    ]
  }
}
