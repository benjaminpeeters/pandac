# Preprocessing script for pandac
# Ensures blank lines before pipe tables (required by pandoc)
# Skips content inside fenced code blocks

BEGIN { in_code_block = 0; prev_line = "" }
{
    # Track fenced code blocks (``` or ~~~)
    if (/^```/ || /^~~~/) {
        in_code_block = !in_code_block
    }

    # If not in code block, line starts with |, and prev line is non-empty and not a table line
    if (!in_code_block && /^\|/ && prev_line != "" && prev_line !~ /^\|/) {
        print ""  # Insert blank line before table
    }

    print
    prev_line = $0
}
