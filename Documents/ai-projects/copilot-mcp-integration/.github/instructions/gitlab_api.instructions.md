# GitLab API & Automation

## Applies when
- Working on GitLab automation code (`**/*.py`, `**/*.yml`, `**/*.yaml`, `.gitlab-ci.yml`, `.github/workflows/**`).
- The conversation mentions GitLab API, MCP GitLab server, or CI/CD flows.

## Instructions
- Use MCP GitLab tools first; show the tool name and required parameters (project ID, MR/issue ID) before invoking API examples.
- Assume read-only unless the user opts in to writes; warn about permissions, branch protections, approvals, and pipeline triggers.
- Handle API hygiene: paginate list calls, set `per_page`, include retries/backoff for transient errors, and note rate limits.
- Keep secrets out of code; reference env vars (`GITLAB_PERSONAL_ACCESS_TOKEN`, `GITLAB_API_URL`, OAuth vars) and encourage project-scoped tokens.
- When editing CI/YAML, call out impacts on pipeline stages, artifacts, manual jobs, and protected environments.

## Snippets
- Minimal MCP server config:
  ```json
  {
    "mcpServers": {
      "gitlab": {
        "command": "npx",
        "args": ["-y", "@zereight/mcp-gitlab"],
        "env": {
          "GITLAB_PERSONAL_ACCESS_TOKEN": "glpat-xxxx",
          "GITLAB_API_URL": "https://gitlab.com/api/v4"
        }
      }
    }
  }
  ```
