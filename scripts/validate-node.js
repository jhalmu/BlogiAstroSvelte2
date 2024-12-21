import * as fs from 'node:fs';
import * as path from 'node:path';
import * as semver from 'semver';
import { exec } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function checkNodeVersion() {
    const nvmrcPath = path.join(process.cwd(), '.nvmrc');
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    
    // Check if .nvmrc exists
    if (!fs.existsSync(nvmrcPath)) {
        console.error('Error: .nvmrc file not found');
        process.exit(1);
    }

    // Check if package.json exists
    if (!fs.existsSync(packageJsonPath)) {
        console.error('Error: package.json file not found');
        process.exit(1);
    }

    // Read required versions
    const nvmrcVersion = fs.readFileSync(nvmrcPath, 'utf8').trim();
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const engineVersion = packageJson.engines?.node;

    // Get current version
    const currentVersion = process.version;

    console.log('\nNode.js Version Check:');
    console.log('---------------------');
    console.log(`Current version: ${currentVersion}`);
    console.log(`Required version (nvmrc): ${nvmrcVersion}`);
    console.log(`Required version (package.json): ${engineVersion}`);

    // Check if using nvm
    try {
        const nvmVersion = await new Promise((resolve, reject) => {
            exec('nvm --version', { stdio: ['pipe', 'pipe', 'ignore'] }, (error, stdout) => {
                if (error) reject(error);
                else resolve(stdout.trim());
            });
        });
        console.log(`NVM version: ${nvmVersion}`);
    } catch (error) {
        console.warn('\nWarning: NVM not found. Consider installing it for better Node.js version management.');
        console.warn('Installation guide: https://github.com/nvm-sh/nvm#installing-and-updating');
    }

    // Verify versions match requirements
    const matchesNvmrc = semver.satisfies(currentVersion, nvmrcVersion);
    const matchesPackageJson = !engineVersion || semver.satisfies(currentVersion, engineVersion);

    if (!matchesNvmrc || !matchesPackageJson) {
        console.error('\nError: Node.js version mismatch!');
        console.error('Please run the following commands to fix:');
        console.error('\n  nvm install');
        console.error('  nvm use');
        console.error('  npm install\n');
        process.exit(1);
    }

    console.log('\n Node.js version is compatible!');
    return true;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    checkNodeVersion().catch(error => {
        console.error('Error:', error);
        process.exit(1);
    });
}

export { checkNodeVersion };
