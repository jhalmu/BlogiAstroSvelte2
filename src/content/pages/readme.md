
#
  -$2title: 'README'

date: '2023-12-19'
author: 'Juha Halmu'
excerpt: 'Project documentation and features'
tags: ['Documentation', 'Project']
image:
  src: '/images/blog/default-hero.jpg'

##   alt: 'Project Documentation'

## # BlogiAstroSvelte

A modern, fast blog built with Astro and styled with TailwindCSS. This blog features a clean, responsive design and excellent performance thanks to Astro's hybrid rendering capabilities.

## # # # # Features

  -$2Lightning-fast performance with Astro
  -$2Beautiful styling with TailwindCSS
  -$2Fully responsive design
  -$2Markdown-based blog posts
  -$2Dynamic blog post sorting
  -$2Breadcrumb navigation
  -$2TypeScript support 💩
  -$2Image optimization with Sharp
  -$2RSS feed with security headers
  -$2Hybrid rendering mode
  -$2Social media integration
  -$2Finnish language support

## # # # # Tech Stack

  -$2[Astro](https://astro.build) - The web framework for content-driven websites
  -$2[TailwindCSS](https://tailwindcss.com) - A utility-first CSS framework
  -$2[TypeScript](https://www.typescriptlang.org) - JavaScript with syntax for types
  -$2[Sharp](https://sharp.pixelplumbing.com) - High performance image processing
  -$2[@astrojs/rss](https://docs.astro.build/en/guides/rss/) - RSS feed generation
  -$2[sanitize-html](https://github.com/apostrophecms/sanitize-html) - HTML sanitization

## # # # # Getting Started


1. Clone the repository:

```text
text
text
text
bash
git clone <<<<https://github.com/jhalmu/BlogiAstroSvelte.git>>>>
cd BlogiAstroSvelte

```text
text
text
text


1. Install dependencies:

```text
text
text
text
bash
npm install

```text
text
text
text


1. Start the development server:

```text
text
text
text
bash
npm run dev

```text
text
text
text


1. Open your browser and visit `<<<<http://localhost:4321`>>>>

## # # # # Available Scripts

  -$2`npm run dev` - Start development server
  -$2`npm run build` - Build your production site
  -$2`npm run preview` - Preview your build locally
  -$2`npm run astro` - Run Astro commands

## # # # # Project Structure

```text
text
text
text
/
├── src/
│   ├── components/

## # # Reusable UI components

│   ├── layouts/

## # # Page layouts

│   ├── pages/

## # # Page components and routes

│   │   ├── blog/

## # # Blog post pages

│   │   └── rss.xml.js

## # # RSS feed configuration

│   ├── content/

## # # Blog post content

│   └── middleware.js

## # # Security and caching middleware

├── public/

## # # Static assets

└── package.json

## # # Project dependencies

```text
text
text
text

## # # # Configuration

The project uses Astro's hybrid rendering configuration with TailwindCSS integration. Key configuration files:
  -$2`astro.config.mjs` - Astro configuration with hybrid mode and RSS prerendering
  -$2`tailwind.config.cjs` - TailwindCSS configuration
  -$2`src/middleware.js` - Security headers and caching configuration
  -$2`src/pages/rss.xml.js` - RSS feed configuration

## # # # # Security Features

  -$2Content sanitization for RSS feed
  -$2Security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy)
  -$2Proper content type settings
  -$2Caching configuration for optimal performance

## # # # # Social Media Integration

The blog includes social media links to:
  -$2BlueSky
  -$2LinkedIn
  -$2GitHub
  -$2RSS Feed

## # # # # License

This project is licensed under the MIT License
  -$2see the LICENSE file for details.

## # # # # Contributing

Contributions, issues, and feature requests are welcome!

## # # # # Development Process

This blog has been developed with the assistance of AI technology. To learn more about the development process and how AI has contributed to this project, visit our [AI Development Story](/about-cascade) page.
