const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const REQUIRED_VARS = [
    // Add your required environment variables here
    'DATABASE_URL',
    'NODE_ENV'
];

function validateEnvFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.error(`Environment file not found: ${filePath}`);
        return false;
    }

    const envConfig = dotenv.parse(fs.readFileSync(filePath));
    const missingVars = [];

    for (const required of REQUIRED_VARS) {
        if (!envConfig[required]) {
            missingVars.push(required);
        }
    }

    if (missingVars.length > 0) {
        console.error(`\nMissing required variables in ${filePath}:`);
        missingVars.forEach(variable => console.error(`- ${variable}`));
        return false;
    }

    // Check for potential security issues
    const securityIssues = [];
    for (const [key, value] of Object.entries(envConfig)) {
        if (value.includes('PRIVATE_KEY') && value.length > 20) {
            securityIssues.push(`${key} might contain a private key`);
        }
        if (key.includes('PASSWORD') || key.includes('SECRET')) {
            if (value === '' || value.toLowerCase() === 'none') {
                securityIssues.push(`${key} has an empty or default value`);
            }
        }
    }

    if (securityIssues.length > 0) {
        console.error('\nPotential security issues:');
        securityIssues.forEach(issue => console.error(`- ${issue}`));
        return false;
    }

    return true;
}

// Validate all env files
const envFiles = ['.env', '.env.dev', '.env.example'];
let hasErrors = false;

for (const file of envFiles) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
        console.log(`\nValidating ${file}...`);
        if (!validateEnvFile(filePath)) {
            hasErrors = true;
        }
    }
}

if (hasErrors) {
    process.exit(1);
}
