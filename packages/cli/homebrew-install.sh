#!/bin/bash
# :ga:meta Homebrew installation script for grepa CLI

set -e

echo "Installing grepa via npm..."

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is required but not installed."
    echo "Install Node.js from: https://nodejs.org/"
    exit 1
fi

# Check if ripgrep is available
if ! command -v rg &> /dev/null; then
    echo "Error: ripgrep is required but not installed."
    echo "Install ripgrep:"
    echo "  macOS: brew install ripgrep"
    echo "  Ubuntu: apt install ripgrep"
    echo "  Other: https://github.com/BurntSushi/ripgrep"
    exit 1
fi

# Install globally via npm
npm install -g @grepa/cli

echo "grepa installed successfully!"
echo "Usage: grepa list --help"