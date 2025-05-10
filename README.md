# Pandac - Pandoc Academic Markdown Converter

**⚠️ Work in Progress ⚠️**

A command-line tool for converting academic Markdown documents to multiple formats (HTML, PDF, LaTeX, DOCX) using Pandoc.

## Features

- Convert Markdown to multiple formats in a single command
- Default multi-format output (PDF + HTML)
- Rich academic citations with BibTeX/CSL support
- Table of contents generation
- Math equation rendering (MathJax/LaTeX)
- Cross-references
- Customizable templates
- Code syntax highlighting (Pygments style by default)
- Clipboard support for code blocks (in HTML output)
- Configurable defaults
- Smart file type detection
- Automatic styling and scripting (no need for YAML headers)
- Clean output with suppressed warnings by default
- Responsive layout with light/dark theme support for HTML output
- Professional error handling and feedback

## Installation

### Quick Install

```bash
git clone https://github.com/benjaminpeeters/pandac.git
cd pandac
./install.sh
```

### Manual Installation

1. Clone the repository
2. Add the `bin` directory to your PATH or copy `bin/pandac` to a directory in your PATH
3. Ensure the `lib` directory is accessible from the script

### Requirements

- [pandoc](https://pandoc.org/) (>= 2.11)
- [pandoc-crossref](https://github.com/lierdakil/pandoc-crossref)
- LaTeX (optional, for PDF output)

## Usage

```bash
pandac [options] [bibliography.bib,...] input.md [output_file]
```

Pandac intelligently identifies files by extension:
- `.bib` files are treated as bibliography sources
- `.md` files are treated as Markdown input
- `.pdf`, `.html`, `.tex`, `.docx` files are treated as output destinations

### Options

- `-f, --format FORMAT`: Output format(s): html, pdf, tex, docx (default: pdf,html)
   - Multiple formats can be specified with commas: `pdf,html,tex`
- `-b, --bibliography FILE`: Specify bibliography file(s) explicitly 
- `-o, --output FILE`: Specify output file (default: input.[format])
- `-n, --no-toc`: Disable table of contents
- `-p, --plain`: Disable standalone mode
- `-m, --no-math`: Disable math rendering
- `-c, --no-citations`: Disable citation processing
- `-s, --clipboard`: Include clipboard.js for code copying (HTML only)
- `-w, --warnings`: Show all warnings (default: hidden)
- `--config`: Edit configuration settings
- `-h, --help`: Display help message
- `-v, --version`: Display version information

### Examples

```bash
# Convert to PDF and HTML (default)
pandac document.md

# Convert to multiple formats
pandac -f pdf,html,tex document.md

# Convert to specific output file
pandac document.md output.pdf

# Use bibliography file (detected automatically by .bib extension)
pandac refs.bib document.md

# Combine multiple bibliography files
pandac refs.bib,extra.bib document.md
# or
pandac refs.bib extra.bib document.md

# Use multiple files in any order
pandac document.md refs.bib output.pdf

# Multiple formats with bibliography
pandac refs.bib document.md -f pdf,html

# Show all warnings (including pandoc-crossref version warnings)
pandac -w document.md

# Edit configuration
pandac --config
```

## Configuration

Pandac uses a configuration file at `~/.config/pandac/config.sh` that's created on first run.

The configuration includes:

- Default bibliography location(s)
- Default output formats
- PDF engine selection
- Custom templates for each format
- Citation style (CSL) specification
- Warning suppression controls
- Format-specific extra options

To edit the configuration:
```bash
pandac --config
```

### YAML Front Matter

You can include optional YAML front matter at the start of your Markdown files:

```markdown
---
title: "Document Title"
author: "Your Name"
date: "May 2024"
---
```

This information will be used in the document's header. However, unlike plain pandoc, you don't need to specify styling, highlighting, or scripts in the YAML - pandac handles this automatically.

### Default Behavior

By default, pandac will:

1. Create both PDF and HTML outputs when no format is specified
2. Look for bibliography files as arguments first
3. Fall back to `bibliography.bib` or `refs.bib` in the current directory
4. Fall back to any configured bibliography paths
5. Use built-in templates for consistent output
6. Apply CSS and JavaScript automatically for HTML output

## License

AGPL-3.0
