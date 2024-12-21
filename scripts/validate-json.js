const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

// Define schemas for different JSON files
const schemas = {
    'blog-images': {
        type: 'object',
        required: ['title', 'alt'],
        properties: {
            title: { type: 'string', minLength: 1 },
            alt: { type: 'string', minLength: 1 },
            caption: { type: 'string' }
        }
    }
};

async function validateJSON(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const json = JSON.parse(content);
        const issues = [];

        // Basic validation
        if (Object.keys(json).length === 0) {
            issues.push('Empty JSON object');
        }

        // Schema validation based on file path
        if (filePath.includes('blog-images')) {
            const validate = ajv.compile(schemas['blog-images']);
            if (!validate(json)) {
                issues.push(...validate.errors.map(err => 
                    `${err.instancePath} ${err.message}`
                ));
            }
        }

        // Check for common issues
        const stringified = JSON.stringify(json);
        if (stringified.includes('http:')) {
            issues.push('Contains non-HTTPS URL');
        }

        if (stringified.length > 1000000) {
            issues.push('File size exceeds 1MB');
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
            issues: [`Error parsing JSON: ${error.message}`]
        };
    }
}

async function validateAllJSON() {
    const jsonFiles = [];

    function findJSONFiles(dir) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory() && !filePath.includes('node_modules')) {
                findJSONFiles(filePath);
            } else if (file.endsWith('.json')) {
                jsonFiles.push(filePath);
            }
        }
    }

    findJSONFiles(process.cwd());
    
    let hasErrors = false;
    for (const file of jsonFiles) {
        console.log(`\nValidating ${path.relative(process.cwd(), file)}...`);
        const result = await validateJSON(file);
        if (!result.valid) {
            hasErrors = true;
            console.error('Issues found:');
            result.issues.forEach(issue => console.error(`- ${issue}`));
        }
    }

    if (hasErrors) {
        process.exit(1);
    } else {
        console.log('\nAll JSON files are valid!');
    }
}

validateAllJSON().catch(error => {
    console.error('Error validating JSON:', error);
    process.exit(1);
});
