import globals from 'globals'
// import pluginJs from '@eslint/js'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

import { FlatCompat } from '@eslint/eslintrc'
import path from 'path'
import { fileURLToPath } from 'url'

// Mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

export default [
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
  { languageOptions: { globals: globals.browser } },
  // pluginJs.configs.recommended,
  ...compat.extends('airbnb'),
  eslintPluginPrettierRecommended,
  {
    rules: {
      'eqeqeq': 'error',
      'no-console': 'off',
      "consistent-return": "off",
      "no-unused-vars": [
        "warn",
        {
          vars: "all",
          args: "none"
        }
      ],
    },
  }
]
