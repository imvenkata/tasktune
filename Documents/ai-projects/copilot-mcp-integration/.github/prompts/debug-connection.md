---
name: "debug-connection"
description: "Diagnose MCP GitLab connectivity and auth issues."
---

# Debug MCP Connection

Walk through these checks before escalating.

## Checklist
- Verify MCP server is configured (`@zereight/mcp-gitlab`) and running.
- Confirm env vars: `GITLAB_PERSONAL_ACCESS_TOKEN` or OAuth fields, `GITLAB_API_URL`, optional project ID and feature flags (`USE_PIPELINE`, `USE_GITLAB_WIKI`, `USE_MILESTONE`).
- Test a lightweight read (e.g., list current user or projects); capture HTTP status and error message.
- Check network/proxy settings and whether read-only mode is enabled.

## Output
- Findings (what passed/failed) and the next action (retry, rotate token, adjust scope).
- If calling MCP tools, show the exact call parameters and results.
