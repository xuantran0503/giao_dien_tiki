module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  rules: {
    // Disable default no-restricted-imports
    'no-restricted-imports': 'off',
    
    // Encourage use of typed hooks
    '@typescript-eslint/no-restricted-imports': [
      'warn',
      {
        name: 'react-redux',
        importNames: ['useSelector', 'useDispatch'],
        message: 'Use typed hooks `useAppDispatch` and `useAppSelector` instead.'
      }
    ],
    
    // Additional TypeScript rules
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    
    // React specific rules
    'react-hooks/exhaustive-deps': 'warn',
    'react/jsx-no-target-blank': 'warn'
  },
  
  // Override for TypeScript files
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        // Stricter rules for TypeScript files
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/prefer-const': 'error'
      }
    }
  ]
};