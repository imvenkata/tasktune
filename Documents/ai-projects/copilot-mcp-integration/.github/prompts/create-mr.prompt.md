---
description: Create a GitLab merge request with proper metadata and description
arguments:
  - name: source_branch
    description: Source branch name
    required: true
  - name: target_branch
    description: Target branch (usually main or master)
    required: true
  - name: title
    description: MR title
    required: true
  - name: project_id
    description: GitLab project ID or path (uses default if not specified)
    required: false
---
# Create Merge Request

Create a GitLab merge request following repository conventions and best practices.

## Prerequisites

- Source branch exists and has commits
- Target branch exists
- User has permissions to create MRs
- Changes are pushed to remote

## MR Creation Process

### Step 1: Validate Branch

- Verify source branch exists
- Check for uncommitted changes
- Ensure branch is pushed to remote
- Confirm target branch exists

### Step 2: Draft MR Description

Create a comprehensive description including:

**What Changed:**
- Summary of changes
- Files modified
- Key features or fixes

**Why It Changed:**
- Business justification
- Problem being solved
- Related issue numbers

**Testing:**
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Documentation updated

**Checklist:**
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] No breaking changes (or documented)
- [ ] CI/CD pipeline passes

### Step 3: Set MR Metadata

- **Title**: Clear, descriptive, follows conventions
- **Labels**: Appropriate labels (type, priority, component)
- **Assignee**: Assign reviewer if applicable
- **Milestone**: Link to sprint/release if relevant
- **Issue Links**: Use `Closes #123` or `Related to #456`

### Step 4: Create MR

Use `create_merge_request` with:
- Source and target branches
- Title and description
- Labels and metadata
- Issue references

## MR Title Conventions

- **Feature**: `feat: Add user authentication`
- **Bugfix**: `fix: Resolve login timeout issue`
- **Refactor**: `refactor: Improve API error handling`
- **Docs**: `docs: Update API documentation`

## Issue Linking

Link issues in MR description:
- `Closes #123` - Closes issue when merged
- `Related to #456` - References without closing
- `Fixes #789` - Alternative to "Closes"
- `Blocks #101` - Indicates dependency

## Output Format

```markdown
✅ Merge Request Created

**MR:** !{mr_iid}
**Title:** {title}
**Project:** {project_path}
**URL:** {mr_url}

**Branches:**
- Source: {source_branch}
- Target: {target_branch}

**Status:** {status}
**Labels:** {labels}

**Next Steps:**
1. Wait for CI/CD pipeline to complete
2. Request review from team members
3. Address any review feedback
4. Merge when approved
```

## Related Instructions

- `.github/instructions/merge_request_review.instructions.md` - Review guidelines
- `.github/instructions/code_development.instructions.md` - Development standards
