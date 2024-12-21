#!/usr/bin/env node

import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOGS_DIR = path.join(__dirname, '../logs');
const LOG_FILE = path.join(LOGS_DIR, 'validation.log');

const execAsync = promisify(exec);

async function logResult(result: { tool: string; status: 'success' | 'error'; message: string; timestamp: string }) {
    if (!fs.existsSync(LOGS_DIR)) {
        fs.mkdirSync(LOGS_DIR, { recursive: true });
    }
    const logEntry = `[${result.timestamp}] ${result.tool}: ${result.status} - ${result.message}\n`;
    fs.appendFileSync(LOG_FILE, logEntry);
    console.log(logEntry);
}

async function runCommand(command: string, label: string): Promise<void> {
    console.log(`\nRunning ${label}...`);
    try {
        const { stdout, stderr } = await execAsync(command, {
            env: { ...process.env, PATH: `${process.env.HOME}/.nvm/versions/node/v22.12.0/bin:${process.env.PATH}` }
        });
        if (stdout) console.log(stdout);
        if (stderr) console.error(stderr);
        await logResult({ tool: label, status: 'success', message: 'Passed', timestamp: new Date().toISOString() });
    } catch (error: any) {
        if (label === 'ESLint' && error.stdout) {
            // For ESLint, we want to show the output even if there are warnings/errors
            console.log(error.stdout);
            if (error.stderr) console.error(error.stderr);
            // Exit with success if only warnings
            if (!error.stdout.includes('✖') || error.stdout.includes('0 errors')) {
                await logResult({ tool: label, status: 'success', message: 'Passed with warnings', timestamp: new Date().toISOString() });
                return;
            }
        }
        console.error(`Error in ${label}:`, error);
        await logResult({ tool: label, status: 'error', message: error.message, timestamp: new Date().toISOString() });
        process.exit(1);
    }
}

async function validateCode() {
    console.log('Starting code validation...');
    
    // Node.js version check
    await runCommand('node -v', 'Node.js Version Check');
    
    // TypeScript check (temporarily disabled)
    console.log('\nSkipping TypeScript checks temporarily...');
    
    // ESLint
    await runCommand('npx eslint "src/**/*.{ts,tsx,js,jsx,svelte}"', 'ESLint');
    
    // Prettier
    await runCommand('npx prettier --check "src/**/*.{ts,tsx,js,jsx,svelte,css,md,json,svg}"', 'Prettier');
    
    // Svelte Check
    await runCommand('npx svelte-check', 'Svelte Check');
    
    // Markdown lint
    await runCommand('npx markdownlint "**/*.md" --ignore node_modules', 'Markdown Lint');
    
    // Remark
    await runCommand('npx remark . --use remark-preset-lint-recommended --frail', 'Remark');
    
    // JSON validation
    await runCommand('node scripts/validate-json.js', 'JSON Validation');
    
    // SQL validation
    await runCommand('node scripts/validate-sql.js', 'SQL Validation');
    
    // SVG validation
    await runCommand('node scripts/validate-svg.js', 'SVG Validation');
    
    // Image validation
    await runCommand('node scripts/validate-images.js', 'Image Validation');
    
    // Environment file check
    await runCommand('node scripts/validate-env.js', 'Env Validation');
    
    // npm audit
    await runCommand('npm audit', 'npm audit');
    
    console.log('Validation complete. Check logs for details.');
}

async function runTests() {
    console.log('Running tests...');
    await runCommand('npx vitest run', 'Unit Tests');
    await runCommand('npx playwright test', 'E2E Tests');
}

async function main() {
    const command = process.argv[2];
    
    switch (command) {
        case 'validate':
            await validateCode();
            break;
        case 'test':
            await runTests();
            break;
        case 'all':
            await validateCode();
            await runTests();
            break;
        default:
            console.error('Invalid command. Use: validate, test, or all');
            process.exit(1);
    }
}

main().catch(error => {
    console.error('Error:', error);
    process.exit(1);
});
