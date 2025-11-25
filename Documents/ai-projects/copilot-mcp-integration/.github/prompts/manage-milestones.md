---
name: "manage-milestones"
description: "Create or update GitLab milestones and related issue lists."
---

# Manage Milestones

Use this to list, create, or update milestones. Default to read-only until the user approves changes.

## Required
- Project/group ID or path
- Action: list, create, update, or report

## Optional
- Title, description, start/due dates, state (active/closed)
- Issues/MRs to include or summarize

## Output
- Clear summary of milestone state and scope.
- If modifying, present MCP parameters before running (project, title, dates, state, linked issues).
