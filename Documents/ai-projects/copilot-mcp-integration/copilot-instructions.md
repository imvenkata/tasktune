# Copilot Instructions

Use these repository-level instructions to guide GitHub Copilot when working with the GitLab MCP integration and related workflows.

## Always
- Prefer the GitLab MCP server (`@zereight/mcp-gitlab`) for any repository, issue, MR, pipeline, or wiki operation; avoid shelling out to GitLab CLIs unless explicitly required.
- Keep responses concise, cite file paths, and confirm before performing destructive steps; never invent tokens or secrets.
- Follow enterprise conventions: semantic branches (`feature/`, `bugfix/`, `hotfix/`, `release/`), link issues in commits (`Closes #123`), and apply project labels accurately.
- Default to read-only advice unless the user confirms write or merge actions; highlight required permissions and environment variables when suggesting commands.

## Context: GitLab platform work
Active when editing `.py`, `.yml`, `.yaml`, `.gitlab-ci.yml`, or `.github/workflows/**`.
- Emphasize GitLab API patterns, CI/CD guidance, and MCP tool usage; include request/response considerations (pagination, rate limits, retries).
- Use structured examples that set `GITLAB_PERSONAL_ACCESS_TOKEN` or OAuth env vars; prefer project-scoped tokens and avoid storing secrets in code.
- For pipelines, call out artifact retention, manual job gates, and read-only fallbacks when write is disabled.

## Context: Documentation and knowledge
Active for `docs/**` and `.md` files.
- Keep documentation instructions actionable and current; include quick links to prompts and agents.
- When describing MCP setup, include minimal env var snippets and how to enable optional features (pipelines, wiki, milestones).

## Reference files
- `.github/copilot-instructions.md` for always-on guardrails.
- `.github/instructions/*.instructions.md` for context-aware rules (GitLab API, issues, code dev, MR review, docs).
- `.github/prompts/*.md` for reusable workflows (issue/MR creation, reviews, pipelines, migrations).
- `.github/agents/*.agent.md` for role-specific Copilot agent configs.

## Quick use
1) Ensure MCP GitLab server is configured (token or OAuth).  
2) Use `@workspace` to invoke prompts like `/create-issue`, `/create-merge-request`, or `/review-merge-request`.  
3) Keep read-only mode on for reviews; explicitly opt into write/merge actions.  
4) See `docs/quick-reference.md` for command examples and env vars.
