# Deployment Guide

This guide explains how to deploy the BlogiAstroSvelte site using GitHub Actions.

## Prerequisites

- A GitHub account with your repository
- A server with SSH access
- Node.js 18 or later installed on your local machine
- Basic knowledge of GitHub and command line

## Local Testing Before Deployment

1. Test the build locally:
```bash
# Clean install dependencies
npm ci

# Build the site
npm run build

# Preview the build
npm run preview
```

2. Check for common issues:
- All images load correctly
- Links work as expected
- Styles are applied properly
- No console errors
- RSS feed generates correctly

## Setting Up GitHub Actions

1. Create the GitHub Actions directory structure:
```bash
mkdir -p .github/workflows
```

2. Create the workflow file `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Server

on:
  push:
    branches:
      - main  # or your default branch name
  # Enable manual trigger
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build site
        run: npm run build

      - name: Deploy to server
        uses: easingthemes/ssh-deploy@main
        with:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
          REMOTE_USER: ${{ secrets.REMOTE_USER }}
          SOURCE: "dist/"
          TARGET: ${{ secrets.REMOTE_PATH }}
          ARGS: "-rlgoDzvc -i"
          EXCLUDE: "/.git/, /.github/, /node_modules/"
```

## Setting Up SSH Keys

1. Generate SSH key pair:
```bash
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"
# Save it to a different file, e.g., ~/.ssh/deploy_key
```

2. On your server:
```bash
# Add public key to authorized_keys
cat deploy_key.pub >> ~/.ssh/authorized_keys

# Set proper permissions
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

## GitHub Repository Setup

1. Go to your repository → Settings → Secrets and variables → Actions

2. Add these secrets:
- `SSH_PRIVATE_KEY`: Your SSH private key (entire content of `deploy_key`)
- `REMOTE_HOST`: Your server's hostname or IP
- `REMOTE_USER`: Your server's SSH username
- `REMOTE_PATH`: Server path (e.g., `/var/www/html/blogiastrosvelte`)

## Server Configuration

1. Prepare the deployment directory:
```bash
# Create deployment directory
sudo mkdir -p /var/www/html/blogiastrosvelte

# Set ownership
sudo chown -R your-user:your-user /var/www/html/blogiastrosvelte

# Set permissions
sudo chmod -R 755 /var/www/html/blogiastrosvelte
```

2. Configure your web server (example for Nginx):
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html/blogiastrosvelte;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires max;
        add_header Cache-Control "public, no-transform";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
}
```

## Testing the Deployment

1. Make a small change to your site

2. Push to GitHub:
```bash
git add .
git commit -m "Test deployment"
git push origin main
```

3. Monitor the deployment:
- Go to your repository → Actions tab
- Watch the workflow progress
- Check for any errors in the logs

4. Verify the deployment:
- Visit your website
- Check that changes are visible
- Test functionality
- Check console for errors
- Verify SSL certificate (if using HTTPS)

## Troubleshooting

Common issues and solutions:

1. **Build Fails**
- Check Node.js version
- Verify all dependencies are installed
- Look for syntax errors in code
- Check for missing environment variables

2. **Deployment Fails**
- Verify SSH key permissions
- Check server connectivity
- Verify target directory permissions
- Check disk space on server

3. **Site Not Updating**
- Clear browser cache
- Check if files were actually deployed
- Verify web server configuration
- Check file permissions on server

4. **404 Errors**
- Verify web server configuration
- Check if all files were deployed
- Confirm correct base URL in Astro config

## Rollback Process

If something goes wrong:

1. Find the last working commit
2. Reset to that commit:
```bash
git reset --hard <commit-hash>
git push --force origin main
```

3. Or restore from backup:
```bash
# On your server
cp -r /path/to/backup /var/www/html/blogiastrosvelte
```

## Monitoring

Consider setting up:
- Uptime monitoring
- Error tracking
- Performance monitoring
- Analytics

## Security Considerations

1. Keep secrets secure:
- Never commit SSH keys
- Use GitHub secrets
- Rotate keys periodically

2. Server security:
- Keep server updated
- Use firewall
- Enable HTTPS
- Set up fail2ban

## Maintenance

Regular tasks:
1. Update dependencies
2. Check for security vulnerabilities
3. Monitor disk space
4. Review logs
5. Backup data

## Support

If you encounter issues:
1. Check GitHub Actions logs
2. Review server logs
3. Open an issue in the repository
4. Contact the maintainer
