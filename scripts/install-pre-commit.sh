#!/bin/bash
# install-pre-commit.sh - Install pre-commit hooks for secret scanning

echo "🔧 Installing pre-commit hooks..."

# Check if pre-commit is installed
if ! command -v pre-commit &> /dev/null; then
    echo "📦 Installing pre-commit..."
    pip install pre-commit || pip3 install pre-commit
fi

# Install the pre-commit hooks
pre-commit install

echo "✅ Pre-commit hooks installed successfully!"
echo "🔒 Your commits will now be scanned for secrets automatically"
