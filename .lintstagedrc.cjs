// Ref: https://nextjs.org/docs/pages/building-your-application/configuring/eslint#lint-staged

module.exports = {
  '*.{js,cjs,jsx,ts,tsx}': 'eslint',
  '*.{js,cjs,jsx,ts,tsx}': 'vitest --run --passWithNoTests',
  '*.{cjs,css,js,json,jsx,md,mdx,ts,tsx}': 'prettier -w',
};
