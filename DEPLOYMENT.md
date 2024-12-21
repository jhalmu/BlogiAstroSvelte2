
# Deployment Guide

This guide explains how to deploy the BlogiAstroSvelte site using GitHub Actions.

## # # Prerequisites
  -$2A GitHub account with your repository
  -$2A server with SSH access
  -$2Node.js 18 or later installed on your local machine
  -$2Basic knowledge of GitHub and command line

## # # Local Testing Before Deployment


1. Test the build locally:

```text
text
bash

## # Clean install dependencies

npm ci

## # Build the site

npm run build

## # Preview the build

npm run preview

```text
text


1. Check for common issues:
  -$2All images load correctly
  -$2Links work as expected
  -$2Styles are applied properly
  -$2No console errors
  -$2RSS feed generates correctly

## # # Setting Up GitHub Actions


1. Create the GitHub Actions directory structure:

```text
text
bash
mkdir -p .github/workflows

```text
text


1. Create the workflow file `.github/workflows/deploy.yml`:

```text
text
yaml
name: Deploy to Server

on:
  push:

```text
    branches:

```text
  -$2main

## or your default branch name

## Enable manual trigger

  workflow_dispatch:

jobs:
  build-and-deploy:

```text
    runs-on: ubuntu-latest

```text

```text
    steps:

```text
  -$2name: Checkout repository

```text
        uses: actions/checkout@v3

```text
  -$2name: Setup Node.js

```text
        uses: actions/setup-node@v3

```text

```text
        with:

```text

```text
          node-version: '18'

```text

```text
          cache: 'npm'

```text
  -$2name: Install dependencies

```text
        run: npm ci

```text
  -$2name: Build site

```text
        run: npm run build

```text
  -$2name: Deploy to server

```text
        uses: easingthemes/ssh-deploy@main

```text

```text
        with:

```text

```text
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}

```text

```text
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }}

```text

```text
          REMOTE_USER: ${{ secrets.REMOTE_USER }}

```text

```text
          SOURCE: "dist/"

```text

```text
          TARGET: ${{ secrets.REMOTE_PATH }}

```text

```text
          ARGS: "-rlgoDzvc -i"

```text

```text
          EXCLUDE: "/.git/, /.github/, /node_modules/"

```text

```text
text

## # Setting Up SSH Keys


1. Generate SSH key pair:

```text
text
bash
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

## # Save it to a different file, e.g., ~/.ssh/deploy_key

```text
text


1. On your server:

```text
text
bash

## # Add public key to authorized_keys

cat deploy_key.pub >> ~/.ssh/authorized_keys

## # Set proper permissions

chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys

```text
text

## # GitHub Repository Setup


1. Go to your repository → Settings → Secrets and variables → Actions


1. Add these secrets:
  -$2`SSH_PRIVATE_KEY`: Your SSH private key (entire content of `deploy_key`)
  -$2`REMOTE_HOST`: Your server's hostname or IP
  -$2`REMOTE_USER`: Your server's SSH username
  -$2`REMOTE_PATH`: Server path (e.g., `/var/www/html/blogiastrosvelte`)

## # # Server Configuration


1. Prepare the deployment directory:

```text
text
bash

## # Create deployment directory

sudo mkdir -p /var/www/html/blogiastrosvelte

## # Set ownership

sudo chown -R your-user:your-user /var/www/html/blogiastrosvelte

## # Set permissions

sudo chmod -R 755 /var/www/html/blogiastrosvelte

```text
text


1. Configure your web server (example for Nginx):

```text
text
nginx
server {

```text
    listen 80;

```text

```text
    server_name your-domain.com;

```text

```text
    root /var/www/html/blogiastrosvelte;

```text

```text
    index index.html;

```text

```text
    location / {

```text

```text
        try_files $uri $uri/ /index.html;

```text

```text
    }

```text

## # Cache static assets

```text
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {

```text

```text
        expires max;

```text

```text
        add_header Cache-Control "public, no-transform";

```text

```text
    }

```text

## # Security headers

```text
    add_header X-Frame-Options "SAMEORIGIN";

```text

```text
    add_header X-XSS-Protection "1; mode=block";

```text

```text
    add_header X-Content-Type-Options "nosniff";

```text

```text
    add_header Referrer-Policy "strict-origin-when-cross-origin";

```text
}

```text
text

## # Testing the Deployment


1. Make a small change to your site


1. Push to GitHub:

```text
text
bash
git add .
git commit -m "Test deployment"
git push origin main

```text
text


1. Monitor the deployment:
  -$2Go to your repository → Actions tab
  -$2Watch the workflow progress
  -$2Check for any errors in the logs


1. Verify the deployment:
  -$2Visit your website
  -$2Check that changes are visible
  -$2Test functionality
  -$2Check console for errors
  -$2Verify SSL certificate (if using HTTPS)

## # # Troubleshooting

Common issues and solutions:


1. **Build Fails**
  -$2Check Node.js version
  -$2Verify all dependencies are installed
  -$2Look for syntax errors in code
  -$2Check for missing environment variables


1. **Deployment Fails**
  -$2Verify SSH key permissions
  -$2Check server connectivity
  -$2Verify target directory permissions
  -$2Check disk space on server


1. **Site Not Updating**
  -$2Clear browser cache
  -$2Check if files were actually deployed
  -$2Verify web server configuration
  -$2Check file permissions on server


1. **404 Errors**
  -$2Verify web server configuration
  -$2Check if all files were deployed
  -$2Confirm correct base URL in Astro config

## # # Rollback Process

If something goes wrong:


1. Find the last working commit


1. Reset to that commit:

```text
text
bash
git reset --hard <commit-hash>
git push --force origin main

```text
text


1. Or restore from backup:

```text
text
bash

## # On your server

cp -r /path/to/backup /var/www/html/blogiastrosvelte

```text
text

## # Monitoring

Consider setting up:
  -$2Uptime monitoring
  -$2Error tracking
  -$2Performance monitoring
  -$2Analytics

## # # Security Considerations


1. Keep secrets secure:
  -$2Never commit SSH keys
  -$2Use GitHub secrets
  -$2Rotate keys periodically


1. Server security:
  -$2Keep server updated
  -$2Use firewall
  -$2Enable HTTPS
  -$2Set up fail2ban

## # # Maintenance

Regular tasks:


1. Update dependencies


1. Check for security vulnerabilities


1. Monitor disk space


1. Review logs


1. Backup data

## # # Support

If you encounter issues:


1. Check GitHub Actions logs


1. Review server logs


1. Open an issue in the repository


1. Contact the maintainer
