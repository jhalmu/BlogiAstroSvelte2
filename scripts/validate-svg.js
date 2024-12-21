const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

const SVG_RULES = {
    // Ensure SVG has viewBox
    'has-viewbox': true,
    // Ensure SVG elements have title for accessibility
    'has-title': true,
    // Ensure consistent attribute order
    'attr-order': true,
    // Ensure no empty groups
    'no-empty-group': true,
    // Ensure IDs are unique
    'unique-ids': true
};

async function validateSVG(filePath) {
    try {
        // Run svglint
        await execAsync(`npx svglint "${filePath}"`);

        // Run SVGO to check for optimization opportunities
        const { stdout } = await execAsync(`npx svgo "${filePath}" --pretty --output-stdout`);
        const originalSize = fs.statSync(filePath).size;
        const optimizedSize = Buffer.from(stdout).length;

        if (optimizedSize < originalSize) {
            console.warn(`\nOptimization possible for ${filePath}:`);
            console.warn(`Current size: ${originalSize} bytes`);
            console.warn(`Potential size: ${optimizedSize} bytes`);
            console.warn(`Potential savings: ${((originalSize - optimizedSize) / originalSize * 100).toFixed(1)}%`);
        }

        // Validate SVG content
        const content = fs.readFileSync(filePath, 'utf8');
        const issues = [];

        // Check for potential issues
        if (!content.includes('viewBox')) {
            issues.push('Missing viewBox attribute');
        }
        if (!content.includes('<title>')) {
            issues.push('Missing title element (accessibility)');
        }
        if (content.includes('style=')) {
            issues.push('Contains inline styles (prefer CSS classes)');
        }

        return {
            path: filePath,
            valid: issues.length === 0,
            issues
        };
    } catch (error) {
        return {
            path: filePath,
            valid: false,
            issues: [`Error validating SVG: ${error.message}`]
        };
    }
}

async function validateAllSVGs() {
    const publicDir = path.join(process.cwd(), 'public');
    const svgFiles = [];

    function findSVGs(dir) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                findSVGs(filePath);
            } else if (path.extname(file).toLowerCase() === '.svg') {
                svgFiles.push(filePath);
            }
        }
    }

    findSVGs(publicDir);
    
    let hasErrors = false;
    for (const file of svgFiles) {
        console.log(`\nValidating ${path.relative(process.cwd(), file)}...`);
        const result = await validateSVG(file);
        if (!result.valid) {
            hasErrors = true;
            console.error('Issues found:');
            result.issues.forEach(issue => console.error(`- ${issue}`));
        }
    }

    if (hasErrors) {
        process.exit(1);
    } else {
        console.log('\nAll SVG files are valid!');
    }
}

validateAllSVGs().catch(error => {
    console.error('Error validating SVGs:', error);
    process.exit(1);
});
