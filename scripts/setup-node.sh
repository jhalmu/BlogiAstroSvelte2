#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Setting up Node.js environment...${NC}"

# Check if nvm is installed
if ! command -v nvm &> /dev/null; then
    echo -e "${RED}NVM is not installed. Installing NVM...${NC}"
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    
    # Source NVM
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
fi

# Install LTS version
echo -e "${YELLOW}Installing Node.js LTS version...${NC}"
nvm install 'lts/*'
nvm use 'lts/*'
nvm alias default 'lts/*'

# Verify installation
NODE_VERSION=$(node -v)
echo -e "${GREEN}Node.js $NODE_VERSION has been installed and set as default${NC}"

# Clean install dependencies
echo -e "${YELLOW}Cleaning and reinstalling dependencies...${NC}"
rm -rf node_modules
rm -f package-lock.json
npm install

echo -e "${GREEN}Setup complete!${NC}"
echo -e "Run ${YELLOW}npm run validate:all${NC} to verify everything is working correctly"
