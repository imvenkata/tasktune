# Repository Instructions (Always Active)

These rules apply to all Copilot chats in this repo. Use them alongside the context-specific instructions in `.github/instructions/`.

## Always
- Respect security: never request or log tokens; point users to environment variables for `GITLAB_PERSONAL_ACCESS_TOKEN` or OAuth fields. Avoid committing secrets.
- Prefer MCP GitLab tools for repository, issue, MR, pipeline, milestone, and wiki actions; show the exact tool or API call you plan to use before acting.
- Be explicit about project scope: confirm project IDs, target branches, and label schemes before making changes.
- Keep suggestions minimal and testable; surface risks (permissions, branch protections, pipeline impacts) and provide rollback/recovery notes when relevant.
- Use concise, stepwise answers with file paths; propose drafts or diffs instead of applying changes automatically unless the user agrees.
