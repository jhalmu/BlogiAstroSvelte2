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
    
    // Fix YAML frontmatter
    if (content.startsWith('---\n')) {
        const frontmatterEnd = content.indexOf('\n---\n', 4);
        if (frontmatterEnd !== -1) {
            const beforeFrontmatter = content.slice(0, frontmatterEnd + 5);
            const afterFrontmatter = content.slice(frontmatterEnd + 5);
            content = beforeFrontmatter + '\n' + afterFrontmatter.trim() + '\n';
        }
    }
    
    // Ensure exactly one blank line at end of file
    content = content.replace(/\n*$/, '\n');
    
    writeFileSync(filePath, content);
}

function processDirectory(dir) {
    const files = readdirSync(dir, { withFileTypes: true });
    
    files.forEach(file => {
        const fullPath = join(dir, file.name);
        if (file.isDirectory()) {
            if (!file.name.startsWith('node_modules')) {
                processDirectory(fullPath);
            }
        } else if (file.name.endsWith('.md')) {
            fixMarkdownFile(fullPath);
            console.log(`Fixed: ${fullPath}`);
        }
    });
}

// Process all markdown files in the project
const directories = [
    join(__dirname, '..', 'docs'),
    join(__dirname, '..', 'project_rules'),
    join(__dirname, '..', 'src', 'content'),
    join(__dirname, '..'),
];

directories.forEach(dir => {
    console.log(`Processing directory: ${dir}`);
    processDirectory(dir);
});
