# Incomplete learning-library revision — do not merge

The workspace disconnected during upload. This branch is a recovery checkpoint, not a completed release. Main and GitHub Pages have not been changed by this revision.

Only app.js, index.html, styles.css and three documentation files reached GitHub. They depend on content/compiler/test changes still in the disconnected workspace and must not be deployed as-is. README counts describe the intended completed revision, not this checkpoint.

Workspace: /workspace/scratch/c39f3354c7de/repo
Upload manifest: /workspace/scratch/c39f3354c7de/revision-files.json
Base main commit: a4b34e1ee31bac23ace33bfb597c4166fc85479e

Completed locally before disconnect:
- Authored 30 concepts, 12 command/query guides, 10 worked scenarios and 30 interview prompts for each of 11 subjects.
- Preserved 1,020 scored questions and the existing Kubernetes question IDs; expanded total interviews to 330.
- Compiled all source into JSON; schema/content checks and Python/JavaScript syntax checks passed.
- Added browser regressions for all modules/subjects, icon selection, roadmap viewport/focus, rendered README link and mobile navigation. Browser suite has NOT run for this revision.

Resume:
1. Restore the workspace and read the upload manifest.
2. Upload the remaining source, generated data, compiler, validation and test files. Do not regenerate from this partial branch's old data.
3. Remove this checkpoint file and run all validation plus Chromium tests in GitHub Actions.
4. Review desktop/mobile rendering and merge only after checks pass.
5. Verify Pages deployment and live behavior.

Pending paths:
- TESTING.md
- content/README.md
- content/kubernetes-bank.json
- scripts/build-subject-packs.py
- scripts/validate-learning-content.js
- scripts/validate-question-bank.js
- scripts/validate-subjects.js
- tests/test_app.py
- content/library/README.md
- content/library/ansible.commands
- content/library/ansible.concepts
- content/library/ansible.interviews
- content/library/ansible.scenarios
- content/library/aws.commands
- content/library/aws.concepts
- content/library/aws.interviews
- content/library/aws.scenarios
- content/library/docker.commands
- content/library/docker.concepts
- content/library/docker.interviews
- content/library/docker.scenarios
- content/library/git.commands
- content/library/git.concepts
- content/library/git.interviews
- content/library/git.scenarios
- content/library/kubernetes.commands
- content/library/kubernetes.concepts
- content/library/kubernetes.interviews
- content/library/kubernetes.scenarios
- content/library/linux.commands
- content/library/linux.concepts
- content/library/linux.interviews
- content/library/linux.scenarios
- content/library/networking.commands
- content/library/networking.concepts
- content/library/networking.interviews
- content/library/networking.scenarios
- content/library/observability.commands
- content/library/observability.concepts
- content/library/observability.interviews
- content/library/observability.scenarios
- content/library/sre.commands
- content/library/sre.concepts
- content/library/sre.interviews
- content/library/sre.scenarios
- content/library/systems.commands
- content/library/systems.concepts
- content/library/systems.interviews
- content/library/systems.scenarios
- content/library/terraform.commands
- content/library/terraform.concepts
- content/library/terraform.interviews
- content/library/terraform.scenarios
- data/ansible-learning.json
- data/ansible.json
- data/aws-learning.json
- data/aws.json
- data/docker-learning.json
- data/docker.json
- data/git-learning.json
- data/git.json
- data/kubernetes-learning.json
- data/kubernetes.json
- data/linux-learning.json
- data/linux.json
- data/networking-learning.json
- data/networking.json
- data/observability-learning.json
- data/observability.json
- data/sre-learning.json
- data/sre.json
- data/systems-learning.json
- data/systems.json
- data/terraform-learning.json
- data/terraform.json
