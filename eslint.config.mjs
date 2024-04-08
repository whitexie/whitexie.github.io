import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: {
    css: true,
    html: true,
    markdown: 'prettier',
  },
  vue: {
    vueVersion: 3,
  },
  typescript: true,
  rules: {
    'quotes': ['error', 'single'],
    'unicorn/filename-case': 'off',
    'unicorn/explicit-length-check': 'off',
    'unicorn/no-array-push-push': 'off',
    'import/no-default-export': 'off',
    'no-console': 'warn',
    'no-undef': ['error'],
    'curly': 'off',
    'vue/block-order': 'off',
    'vue/no-deprecated-slot-attribute': 'off',
    'ts/no-invalid-this': 'off',
    'vue/v-on-event-hyphenation': ['off'],
    'vue/valid-define-emits': 'error',
    'vue/no-v-for-template-key-on-child': 'off',
    'vue/custom-event-name-casing': 'off',
    'vue/no-deprecated-v-bind-sync': 'off',
    'no-invalid-this': 'error',
    'vue/no-mutating-props': [
      'error',
      {
        shallowOnly: true,
      },
    ],
    'style/semi': 'off',
    'semi': [2, 'always'],
  },
})
