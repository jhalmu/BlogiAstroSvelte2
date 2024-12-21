#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function fixMarkdownFile(filePath) {
    let content = readFileSync(filePath, 'utf8');
    
    // Fix multiple consecutive blank lines (MD012)
    content = content.replace(/\n{3,}/g, '\n\n');
    
    // Fix blank lines inside blockquotes (MD028)
    content = content.replace(/(^>.*$\n)\n+(^>.*$)/gm, '$1$2');
    
    // Fix headings not surrounded by blank lines (MD022)
    content = content.replace(/(?<!^\n|\n\n)(^#+\s.*$)/gm, '\n$1');
    content = content.replace(/(^#+\s.*$)(?!\n$|\n\n)/gm, '$1\n');
    
    // Fix lists not surrounded by blank lines (MD032)
    content = content.replace(/(?<!^\n|\n\n)(^[\s]*[-*+][\s].*$)/gm, '\n$1');
    content = content.replace(/(^[\s]*[-*+][\s].*$)(?!\n$|\n\n)/gm, '$1\n');
    content = content.replace(/(?<!^\n|\n\n)(^[\s]*\d+\.[\s].*$)/gm, '\n$1');
    content = content.replace(/(^[\s]*\d+\.[\s].*$)(?!\n$|\n\n)/gm, '$1\n');
    
    // Fix fenced code blocks not surrounded by blank lines (MD031)
    content = content.replace(/(?<!^\n|\n\n)(^```.*$)/gm, '\n$1');
    content = content.replace(/(^```\s*$)(?!\n$|\n\n)/gm, '$1\n');
    
    // Fix trailing spaces (MD009)
    content = content.replace(/[ \t]+$/gm, '');
    
    // Fix code blocks without language specification (MD040)
    content = content.replace(/^```\s*$/gm, '```text');
    
    // Fix heading style consistency (MD003)
    content = content.replace(/^(#+)=+\s*$/gm, '$1');  // Convert setext to ATX
    content = content.replace(/^(#+\s.*?)\s*#+\s*$/gm, '$1');  // Remove closing hashes
    
    // Fix multiple spaces after hash in headings (MD019)
    content = content.replace(/^(#+)\s+/gm, '$1 ');
    
    // Fix list indentation
    content = content.replace(/^(\s+)[-*+](\s+)/gm, (match, indent) => {
        // Convert indentation to multiples of 2 spaces
        const spaces = indent.length;
        const normalizedSpaces = Math.ceil(spaces / 2) * 2;
        return ' '.repeat(normalizedSpaces) + '-$2';
    });
    
    // Fix ordered list item prefixes
    content = content.replace(/^(\s*)\d+\./gm, '$11.');
    
    // Fix bare URLs
    content = content.replace(/(?<![\[\(])(https?:\/\/[^\s\)]+)(?![\]\)])/g, '<$1>');
    
    // Fix trailing punctuation in headings (MD026)
    content = content.replace(/^(#+\s.*?)[.,;:!]\s*$/gm, '$1');
    
    // Ensure single newline at end of file
    content = content.replace(/\n*$/, '\n');
    
    writeFileSync(filePath, content);
    console.log(`Fixed: ${filePath}`);
}

function processDirectory(dir) {
    const files = readdirSync(dir, { withFileTypes: true });
    
    for (const file of files) {
        const fullPath = join(dir, file.name);
        
        if (file.isDirectory()) {
            processDirectory(fullPath);
        } else if (file.name.endsWith('.md')) {
            fixMarkdownFile(fullPath);
        }
    }
}

// Process all markdown files in the project
const directories = [
    join(__dirname, '..', 'docs'),
    join(__dirname, '..', 'project_rules'),
    join(__dirname, '..', 'src', 'content'),
    join(__dirname, '..', 'src', 'content', 'blog'),
    join(__dirname, '..', 'src', 'content', 'pages'),
    join(__dirname, '..', 'project_rules', 'templates')
];

for (const dir of directories) {
    try {
        processDirectory(dir);
    } catch (error) {
        console.error(`Error processing directory ${dir}:`, error.message);
    }
}
