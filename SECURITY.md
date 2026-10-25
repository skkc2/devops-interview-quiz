# Security and repository access

## Reporting

Do not put real credentials or sensitive incident data into public issues or pull requests. If you discover an exposed credential, tell the owner the affected path and commit without repeating the value. Revoke or rotate a real exposed credential; removing its current file does not remove its history or invalidate it.

## Repository controls

Public visibility allows reading, cloning and forking; it does not grant push access. Only the owner, explicitly authorized collaborators and authorized integrations can write. A contribution does not automatically make its author a collaborator.

At the security review, the default branch was `main`, GitHub reported it unprotected, and the ruleset list was empty. The connected integration could not access administration-level protection settings. CODEOWNERS routes reviews; it does not itself enforce access restrictions.

Before the next release, the owner must verify these settings:

1. Settings → Collaborators: retain only intended access. Review installed GitHub Apps, deploy keys and any other write-capable access. Do not add write access merely to accept a fork PR.
2. Settings → Rules → Rulesets: create an **Active branch ruleset** targeting the default branch and `refs/heads/master` if that legacy name is to be reserved. Enable **Restrict updates**, **Restrict deletions** and **Block force pushes**. Grant update bypass only to the owner/admin role after confirming no other admin principals have access; do not add blanket collaborator or integration bypasses. Only authorized bypass actors can update that branch, including merging PRs.
3. Add a separate quality ruleset requiring PRs, successful validation and resolved conversations. Configure owner bypass deliberately if you want to retain direct owner pushes. CODEOWNER-review requirements need this enforcement and should not deadlock the owner's own PRs.
4. GitHub's normal repository permissions already prevent non-collaborators from creating branches in this repository. They can create branches in their own forks. If even invited writers must be prevented from creating upstream branches, add a separate all-branches **Restrict creations** rule with only owner bypass.
5. Settings → Code security: enable secret scanning and push protection where available. Settings → Actions: require approval for all outside contributors, keep default token permissions read-only, and leave workflow PR approval disabled. Verify Pages deployment is limited to the intended branch.

A GitHub API permission denial is not evidence that protections are configured. Do not describe the repository as owner-only protected until settings and effective access are verified.

## Workflow controls

- Validation runs with read-only repository contents permission.
- Checkout does not persist credentials into Git configuration.
- Official actions are pinned to verified upstream commit SHAs; Dependabot proposes updates.
- Pages write and OIDC permissions are confined to the deployment job.
- Release write permissions are confined to the release job. Publication requires an explicit owner-triggered workflow dispatch on main and successful validation. No release is triggered by a fork pull request.
- Gitleaks v8.30.1 scans all fetched Git branch/tag history, including deleted file content, before validation, deployment and release. Findings are redacted in logs. A clean scan is evidence, not proof that every possible secret format is absent.
- `${{ github.token }}` refers to GitHub's temporary workflow credential. It is not a literal committed token. Do not print it, copy it into source, or replace it with a hard-coded personal token.

The static app has no backend authentication or application API credentials. Notes stay in browser storage and are not encrypted secret storage. No scan can establish the contents of inaccessible repository secrets, all historical workflow logs, deleted remote refs, forks or external copies.
