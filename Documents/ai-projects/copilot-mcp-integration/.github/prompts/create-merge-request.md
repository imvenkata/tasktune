---
name: "create-merge-request"
description: "Scaffold a GitLab merge request draft with metadata and checklists."
---

# Create Merge Request

Gather project context, then propose an MR draft with the structure below.

## Required
- Project ID or path
- Source branch and target branch
- Title and brief summary of changes

## Optional
- Issue links (`Closes #123`), labels, draft status, reviewers/assignees, milestone, pipeline requirements

## Output
- MR title, description template (Context, Changes, Tests, Risks, Rollback), labels, reviewers, target branch.
- If writes are allowed, present the MCP tool call (project ID, source/target, title/body, draft flag) for confirmation before execution.
