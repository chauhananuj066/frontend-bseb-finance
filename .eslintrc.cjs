module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'node_modules'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    react: { version: 'detect' },
    'import/resolver': {
      alias: {
        map: [
          ['@', './src'],
          ['@components', './src/components'],
          ['@pages', './src/pages'],
          ['@hooks', './src/hooks'],
          ['@services', './src/services'],
          ['@utils', './src/utils'],
          ['@styles', './src/styles'],
          ['@store', './src/store'],
          ['@config', './src/config']
        ],
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    }
  },
  plugins: ['react-refresh'],
  rules: {
    // ✅ React 17+ ke liye React import ki zarurat nahi
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',

    // ✅ PropTypes ki zarurat nahi (agar aap TS use karoge ya nahi karte)
    'react/prop-types': 'off',

    // ✅ Unused variables / imports ignore kar diye
    'no-unused-vars': 'off',

    // ✅ Console allowed sirf warn/error (log ignore ho jaye)
    'no-console': ['warn', { allow: ['warn', 'error'] }],

    // ✅ Fast Refresh warning sirf as warning aaye
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}; 
