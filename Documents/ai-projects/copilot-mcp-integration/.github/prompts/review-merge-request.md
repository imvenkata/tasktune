---
name: "review-merge-request"
description: "Perform a structured GitLab MR review with actionable findings."
---

# Review Merge Request

Use MCP GitLab tools in read-only mode unless the user approves posting notes. Focus on correctness and risk.

## Required
- Project ID/path and MR ID
- Scope (full review, targeted area, or follow-up)

## Review Flow
1. Fetch MR details (diffs, pipeline status, approvals, labels).
2. Identify high-severity issues first (functional bugs, security, regressions).
3. Capture missing tests/docs and branch/pipeline blockers.
4. Propose concise, actionable comments (what/why/how) with file/line references.

## Output
- Ordered findings (High → Medium → Low) plus testing/docs gaps.
- Optional: draft note payloads ready for MCP submission after user confirmation.
