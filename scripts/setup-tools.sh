#!/bin/bash

# Development dependencies
npm install --save-dev \
    typescript \
    @typescript-eslint/parser \
    @typescript-eslint/eslint-plugin \
    eslint \
    eslint-plugin-svelte \
    prettier \
    prettier-plugin-svelte \
    svelte-check \
    vitest \
    @testing-library/svelte \
    @playwright/test \
    msw \
    vite-bundle-analyzer \
    @types/node \
    markdownlint-cli \
    remark-cli \
    remark-lint \
    remark-preset-lint-recommended \
    jsonlint \
    sharp \
    dotenv \
    svglint \
    svgo \
    ajv \
    ajv-formats \
    sql-lint

# Production dependencies
npm install \
    winston \
    pino \
    helmet \
    @astrojs/check

# Make validation and fix scripts executable
chmod +x scripts/validate.ts
chmod +x scripts/fix-markdown.js

# Run initial markdown fixes
echo "Running initial markdown fixes..."
node scripts/fix-markdown.js

echo "Setup complete! You can now run:"
echo "npm run validate - to check code quality"
echo "npm run test - to run tests"
echo "npm run validate:all - to run both"
echo "node scripts/fix-markdown.js - to fix markdown formatting issues"
