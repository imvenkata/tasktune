---
description: Migrate a single Confluence page to markdown format
arguments:
  - name: page_id
    description: Confluence page ID or URL
    required: true
  - name: space_key
    description: Confluence space key
    required: false
  - name: output_path
    description: Output directory path (default: docs/)
    required: false
---
# Migrate Confluence Page

Fetch and migrate a single Confluence wiki page to markdown format, preserving structure and formatting.

## Prerequisites

- Confluence MCP server configured
- Valid Confluence API credentials
- Access to the target page

## Migration Process

### Step 1: Identify Page

- Extract page ID from URL if provided
- Verify page exists and is accessible
- Get page metadata (title, space, parent)

### Step 2: Fetch Page Content

Use Confluence MCP tools:
- `get_page`: Get page details
- `get_page_content`: Get page body
- `list_child_pages`: Get child pages if needed
- `get_page_attachments`: Get attachments

### Step 3: Convert to Markdown

Convert Confluence storage format to markdown:
- Preserve headings hierarchy
- Convert tables to markdown tables
- Handle code blocks and syntax highlighting
- Preserve links (convert to relative if local)
- Handle images and attachments
- Maintain list formatting

### Step 4: Save to File

- Create appropriate filename from page title
- Sanitize filename (remove special characters)
- Save to `docs/` directory (or specified path)
- Include frontmatter with metadata:
  - Original URL
  - Last updated date
  - Space key
  - Parent page (if applicable)

### Step 5: Handle Attachments

- Download images and attachments
- Update image paths to local references
- Save attachments to `docs/assets/` or similar
- Preserve relative paths

## Output Format

```markdown
---
source: Confluence
original_url: https://company.atlassian.net/wiki/spaces/ENG/pages/123456
space_key: ENG
last_updated: 2024-02-15
---

# Page Title

[Converted content here]
```

## Filename Conventions

- Use page title as base filename
- Replace spaces with hyphens
- Lowercase
- Remove special characters
- Example: `getting-started.md`

## Related Instructions

- `.github/instructions/confluence_docs.instructions.md` - Documentation patterns
- `.github/prompts/migrate-confluence-space.md` - Full space migration
