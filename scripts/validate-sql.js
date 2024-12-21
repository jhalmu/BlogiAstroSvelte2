const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function validateSQL() {
    const migrationsDir = path.join(process.cwd(), 'src', 'db', 'migrations');
    const knexfile = path.join(process.cwd(), 'knexfile.ts');

    if (!fs.existsSync(migrationsDir)) {
        console.log('No migrations directory found.');
        return;
    }

    try {
        // Validate migration files
        console.log('\nValidating migration files...');
        const files = fs.readdirSync(migrationsDir)
            .filter(f => f.endsWith('.ts'));

        for (const file of files) {
            const filePath = path.join(migrationsDir, file);
            console.log(`\nChecking ${file}...`);

            // Parse and validate migration file
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Check for common issues
            const issues = [];

            // Check for up/down methods
            if (!content.includes('up') || !content.includes('down')) {
                issues.push('Missing up() or down() methods');
            }

            // Check for transaction usage
            if (!content.includes('trx') && !content.includes('transaction')) {
                issues.push('Warning: No transaction usage detected');
            }

            // Check for table operations
            if (content.includes('createTable') && !content.includes('dropTable')) {
                issues.push('Warning: createTable without matching dropTable in down migration');
            }

            // Check for proper typing
            if (!content.includes(': Knex')) {
                issues.push('Warning: Missing Knex type annotations');
            }

            if (issues.length > 0) {
                console.log('Issues found:');
                issues.forEach(issue => console.log(`- ${issue}`));
            }
        }

        // Validate migrations can run
        console.log('\nValidating migration integrity...');
        await execAsync('npm run db:migrate:check', { stdio: 'inherit' });

        console.log('\nSQL validation complete!');
    } catch (error) {
        console.error('Error during SQL validation:', error.message);
        process.exit(1);
    }
}

validateSQL().catch(error => {
    console.error('Error:', error);
    process.exit(1);
});
