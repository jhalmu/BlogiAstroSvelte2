# BlogiAstroSvelte

A modern, fast blog built with Astro and styled with TailwindCSS. This blog features a clean, responsive design and excellent performance thanks to Astro's hybrid rendering capabilities.

## Features

- Lightning-fast performance with Astro
- Beautiful styling with TailwindCSS
- Fully responsive design
- Markdown-based blog posts
- Dynamic blog post sorting
- Breadcrumb navigation
- TypeScript support 💩
- Image optimization with Sharp
- RSS feed with security headers
- Hybrid rendering mode
- Social media integration
- Finnish language support
# Test Deployment
- Testing GitHub Actions deployment

## Tech Stack

- [Astro](https://astro.build) - The web framework for content-driven websites
- [TailwindCSS](https://tailwindcss.com) - A utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org) - JavaScript with syntax for types
- [Sharp](https://sharp.pixelplumbing.com) - High performance image processing
- [@astrojs/rss](https://docs.astro.build/en/guides/rss/) - RSS feed generation
- [sanitize-html](https://github.com/apostrophecms/sanitize-html) - HTML sanitization

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/jhalmu/BlogiAstroSvelte.git
cd BlogiAstroSvelte
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and visit `http://localhost:4321`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build your production site
- `npm run preview` - Preview your build locally
- `npm run astro` - Run Astro commands

## Project Structure

```
/
├── src/
│   ├── components/    # Reusable UI components
│   ├── layouts/       # Page layouts
│   ├── pages/         # Page components and routes
│   │   ├── blog/     # Blog post pages
│   │   └── rss.xml.js # RSS feed configuration
│   ├── content/      # Blog post content
│   └── middleware.js # Security and caching middleware
├── public/           # Static assets
└── package.json      # Project dependencies
```

## Configuration

The project uses Astro's hybrid rendering configuration with TailwindCSS integration. Key configuration files:

- `astro.config.mjs` - Astro configuration with hybrid mode and RSS prerendering
- `tailwind.config.cjs` - TailwindCSS configuration
- `src/middleware.js` - Security headers and caching configuration
- `src/pages/rss.xml.js` - RSS feed configuration

## Security Features

- Content sanitization for RSS feed
- Security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy)
- Proper content type settings
- Caching configuration for optimal performance

## Social Media Integration

The blog includes social media links to:

- BlueSky
- LinkedIn
- GitHub
- RSS Feed

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions, issues, and feature requests are welcome!

## Development Process

This blog has been developed with the assistance of AI technology. To learn more about the development process and how AI has contributed to this project, visit our [AI Development Story](/about-cascade) page.
