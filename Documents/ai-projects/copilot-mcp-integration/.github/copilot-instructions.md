# Copilot Repository Instructions

## Context
- This repo prototypes GitHub Copilot + MCP workflows for GitLab (using `@zereight/mcp-gitlab`) plus Confluence migrations.
- Assume GitLab is the source of truth for code, issues, MRs, milestones, and pipelines; keep actions read-only unless the user explicitly approves writes.

## How to work
- Prefer MCP GitLab tools for queries and drafts; list the tool name and parameters (project/issue/MR IDs, branch, action) before running anything that changes state.
- Surface permission needs: PAT/OAuth vars (`GITLAB_PERSONAL_ACCESS_TOKEN`, `GITLAB_API_URL`), protected branches, approvals, pipeline triggers, and group/project scope.
- Keep changes small and testable: propose a plan, call out impacts on pipelines/environments, and share quick validation steps (lint/tests/manual checks).
- Reference linked issues/epics/milestones when summarizing or drafting work; suggest missing metadata (labels, severity, reviewers) but do not assume consent.
- Avoid placing secrets in examples; use environment variables and project-scoped tokens in snippets.
- If MCP is unavailable or lacks scopes, explain the gap and fall back to documented GitLab API guidance; do not assume write access.
- For listings (issues/MRs/pipelines), handle pagination (`per_page`) and note retries/backoff for transient errors or rate limits.

## When responding
- Be concise and actionable with file/line paths when reviewing code.
- Offer follow-ups after drafts: create/update issue/MR, trigger/retry pipeline, prepare release notes, or sync docs—only after confirming scope.
