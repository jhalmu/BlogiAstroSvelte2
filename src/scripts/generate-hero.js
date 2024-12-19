import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';

async function generateHeroImage() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Set viewport to match our desired image dimensions
    await page.setViewport({
        width: 1200,
        height: 630,
        deviceScaleFactor: 2, // For better quality
    });
    
    // Read the HTML file
    const htmlPath = path.join(process.cwd(), 'src', 'scripts', 'generate-hero.html');
    const html = await fs.readFile(htmlPath, 'utf8');
    
    // Set the HTML content
    await page.setContent(html, {
        waitUntil: 'networkidle0'
    });
    
    // Ensure the output directory exists
    const outputDir = path.join(process.cwd(), 'public', 'images');
    await fs.mkdir(outputDir, { recursive: true });
    
    // Take the screenshot
    await page.screenshot({
        path: path.join(outputDir, 'default-hero.jpg'),
        type: 'jpeg',
        quality: 90
    });
    
    await browser.close();
    console.log('Hero image generated successfully!');
}

generateHeroImage().catch(console.error);
