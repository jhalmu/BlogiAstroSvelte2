const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const MAX_IMAGE_SIZE = 1024 * 1024; // 1MB
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.webp'];

async function validateImage(filePath) {
    const stats = fs.statSync(filePath);
    const issues = [];

    // Check file size
    if (stats.size > MAX_IMAGE_SIZE) {
        issues.push(`File size exceeds 1MB: ${(stats.size / 1024 / 1024).toFixed(2)}MB`);
    }

    try {
        // Get image metadata
        const metadata = await sharp(filePath).metadata();
        
        // Check dimensions
        if (metadata.width > 2000 || metadata.height > 2000) {
            issues.push(`Image dimensions too large: ${metadata.width}x${metadata.height}`);
        }

        // Check format
        if (!SUPPORTED_FORMATS.includes(path.extname(filePath).toLowerCase())) {
            issues.push(`Unsupported image format: ${path.extname(filePath)}`);
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
            issues: [`Error processing image: ${error.message}`]
        };
    }
}

async function validateAllImages() {
    const publicDir = path.join(process.cwd(), 'public');
    const imageFiles = [];

    function findImages(dir) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                findImages(filePath);
            } else if (SUPPORTED_FORMATS.includes(path.extname(file).toLowerCase())) {
                imageFiles.push(filePath);
            }
        }
    }

    findImages(publicDir);
    
    let hasErrors = false;
    for (const file of imageFiles) {
        const result = await validateImage(file);
        if (!result.valid) {
            hasErrors = true;
            console.error(`\nIssues in ${result.path}:`);
            result.issues.forEach(issue => console.error(`- ${issue}`));
        }
    }

    if (hasErrors) {
        process.exit(1);
    }
}

validateAllImages().catch(error => {
    console.error('Error validating images:', error);
    process.exit(1);
});
