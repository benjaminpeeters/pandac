#!/bin/bash
# pandac installer

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Create directories if needed
mkdir -p "$HOME/.local/bin"
mkdir -p "$HOME/.local/share/pandac/lib"
mkdir -p "$HOME/.local/share/pandac/templates"

# Copy files
cp "$SCRIPT_DIR/bin/pandac" "$HOME/.local/bin/"
cp -r "$SCRIPT_DIR/lib/"* "$HOME/.local/share/pandac/lib/"
if [ -d "$SCRIPT_DIR/templates" ] && [ "$(ls -A "$SCRIPT_DIR/templates")" ]; then
    cp -r "$SCRIPT_DIR/templates/"* "$HOME/.local/share/pandac/templates/"
fi

# Make executable
chmod +x "$HOME/.local/bin/pandac"

# Check if ~/.local/bin is in PATH
if [[ ":$PATH:" != *":$HOME/.local/bin:"* ]]; then
    echo "Adding ~/.local/bin to PATH in your shell profile"
    if [ -f "$HOME/.bashrc" ]; then
        echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$HOME/.bashrc"
    fi
    if [ -f "$HOME/.zshrc" ]; then
        echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$HOME/.zshrc"
    fi
fi

# Check for required dependencies
echo "Checking dependencies..."
if ! command -v pandoc &> /dev/null; then
    echo "Warning: pandoc is not installed. Please install pandoc to use this tool."
fi

if ! pip3 list | grep -q "pandoc-crossref"; then
    echo "Warning: pandoc-crossref is not installed. Install with: pip install pandoc-crossref"
fi

echo "pandac installed successfully!"
echo "Run 'pandac --help' to get started"