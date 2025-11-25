---
description: Debug and test MCP server connections for GitLab and Confluence
arguments: []
---
# Debug MCP Connection

Test and troubleshoot MCP server connections for GitLab and Confluence.

## Prerequisites

- MCP servers configured in editor settings
- Environment variables set (if using `.env` file)
- API tokens configured

## Debugging Process

### Step 1: Check Configuration

Verify MCP server configuration:
- Configuration file exists and is valid JSON
- Server commands are correct
- Environment variables are set
- File paths are correct

### Step 2: Test GitLab Connection

**Basic Connection Test:**
- List projects: `list_projects` or `search_repositories`
- Get current user: Verify authentication
- Check token permissions

**Common Issues:**
- `401 Unauthorized`: Invalid or expired token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Incorrect API URL
- Connection timeout: Network/firewall issues

### Step 3: Test Confluence Connection

**Basic Connection Test:**
- List spaces: `list_spaces`
- Get a test page: Verify read access
- Check API token validity

**Common Issues:**
- Authentication failed: Invalid credentials
- Permission denied: Insufficient access
- API URL incorrect: Wrong instance URL

### Step 4: Verify Feature Flags

Check if optional features are enabled:
- `USE_PIPELINE`: Pipeline tools available
- `USE_GITLAB_WIKI`: Wiki tools available
- `USE_MILESTONE`: Milestone tools available

### Step 5: Report Results

Provide comprehensive report:
- Connection status for each server
- Available tools
- Any errors or warnings
- Suggested fixes

## Output Format

```markdown
🔍 MCP Connection Diagnostics

### GitLab MCP Server
**Status:** ✅ Connected
**API URL:** https://gitlab.com/api/v4
**Authentication:** Valid
**Available Tools:** 45/80
**Feature Flags:**
  - USE_PIPELINE: enabled
  - USE_GITLAB_WIKI: disabled
  - USE_MILESTONE: enabled

### Confluence MCP Server
**Status:** ✅ Connected
**Instance:** https://company.atlassian.net
**Authentication:** Valid
**Available Tools:** 9/9

### Issues Found
- None

### Recommendations
- All systems operational
```

## Troubleshooting Guide

### Problem: MCP Server Not Loading

**Solutions:**
1. Check configuration file syntax (valid JSON)
2. Verify file path is correct
3. Ensure environment variables are set
4. Restart AI assistant

### Problem: Authentication Failing

**Solutions:**
1. Verify token is valid and not expired
2. Check token has required scopes
3. Test token with curl command
4. Regenerate token if needed

### Problem: Tools Not Available

**Solutions:**
1. Enable feature flags in configuration
2. Verify token permissions
3. Restart AI assistant
4. Check tool names match documentation

## Related Resources

- `.github/instructions/gitlab_api.instructions.md` - GitLab API patterns
- `docs/quick-reference.md` - Configuration examples
