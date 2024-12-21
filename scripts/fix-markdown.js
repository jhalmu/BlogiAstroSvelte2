#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function fixMarkdownFile(filePath) {
    let content = readFileSync(filePath, 'utf8');
    
    // Fix headings not surrounded by blank lines (both above and below)
    content = content.replace(/(?<!^\n)(#+\s.*$)/gm, '\n$1');
    content = content.replace(/(^#+\s.*$)(?!\n)/gm, '$1\n');
    
    // Fix heading styles (convert all to ATX style)
    content = content.replace(/^(.+)\n[=]+$/gm, '# $1');
    content = content.replace(/^(.+)\n[-]+$/gm, '## $1');
    content = content.replace(/^#+\s*(.*?)\s*#+\s*$/gm, '# $1');
    
    // Fix lists not surrounded by blank lines
    content = content.replace(/(?<!^\n|\n\n)((?:-|\d+\.|\>?\s*-|\>?\s*\d+\.)\s.*$)/gm, '\n$1');
    content = content.replace(/(^(?:-|\d+\.|\>?\s*-|\>?\s*\d+\.)\s.*$)(?!\n)/gm, '$1\n');
    
    // Fix list indentation
    content = content.replace(/^(\s+)[-*+](\s+)/gm, '- $2');  // Convert all list markers to -
    content = content.replace(/^(\s{2,})[-*+]/gm, '  -');     // Fix excessive indentation
    
    // Fix ordered list item prefixes
    content = content.replace(/^(\s*)\d+\./gm, '$11.');
    
    // Fix code blocks
    content = content.replace(/^([ ]{4,}[^\n]+)$/gm, '```\n$1\n```'); // Convert indented code blocks to fenced
    content = content.replace(/(?<!^\n|\n\n)```/g, '\n```');
    content = content.replace(/```(?!\n)/g, '```\n');
    content = content.replace(/^```\s*$/gm, '```text');
    
    // Fix trailing spaces and punctuation in headings
    content = content.replace(/[ \t]+$/gm, '');
    content = content.replace(/^(#+\s.*?)[:.]\s*$/gm, '$1');
    
    // Fix multiple consecutive blank lines
    content = content.replace(/\n{3,}/g, '\n\n');
    
    // Fix blank lines inside blockquotes
    content = content.replace(/>\s*\n\s*>\s*\n\s*>/g, '> \n>');
    
    // Fix bare URLs
    content = content.replace(/(?<![\[\(])(https?:\/\/[^\s\)]+)(?![\]\)])/g, '<$1>');
    
    // Fix multiple top-level headings
    let foundFirstH1 = false;
    content = content.replace(/^#\s+(.*)$/gm, (match, title) => {
        if (!foundFirstH1) {
            foundFirstH1 = true;
            return match;
        }
        return `## ${title}`;
    });
    
    // Fix list item consistency
    content = content.replace(/^(\s*)[*+-](\s+)/gm, '$1-$2');
    
    // Fix link fragments
    content = content.replace(/\[([^\]]+)\]\(#[^\)]+\)/g, '$1');
    
    // Fix YAML frontmatter
    if (content.startsWith('---\n')) {
        const frontmatterEnd = content.indexOf('\n---\n', 4);
        if (frontmatterEnd !== -1) {
            const beforeFrontmatter = content.slice(0, frontmatterEnd + 5);
            const afterFrontmatter = content.slice(frontmatterEnd + 5);
            content = beforeFrontmatter + '\n' + afterFrontmatter.trim() + '\n';
        }
    }
    
    // Ensure file starts and ends with a single newline
    content = content.trim() + '\n';
    
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
