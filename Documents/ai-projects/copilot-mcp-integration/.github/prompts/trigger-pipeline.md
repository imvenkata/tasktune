---
name: "trigger-pipeline"
description: "Trigger or retry a GitLab pipeline with guardrails."
---

# Trigger or Retry Pipeline

Confirm intent and scope before running any pipeline action.

## Required
- Project ID/path
- Branch or pipeline ID
- Action: trigger new, retry failed, play manual job

## Safety
- Confirm environment impact, protected branches, and required variables.
- Note if pipeline should run in dry-run/read-only mode (if available) or skip dangerous jobs.

## Output
- Action plan (which project/branch/pipeline, why, expected outcome) and MCP tool parameters.
- If executing, show the exact trigger/retry call and how to check status/logs afterward.
