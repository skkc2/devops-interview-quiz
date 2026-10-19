# Learning roadmap and gap analysis

## Baseline findings

- Two independent single-file HTML quiz prototypes exist.
- The older page has 210 multiple-choice questions across seven technologies and three levels, but no explanations and requests for 50–200 questions can be silently truncated to the available pool.
- The newer page has 25 questions, explanations, a timer, and review, but the small bank can repeat the same question in a session.
- There was no README, dedicated homepage, automated validation, or CI workflow.
- SRE coverage existed, but systems administration, observability, networking, and practical diagnostic scenarios were underrepresented.

## Work delivered in this branch

- Added a recommended \`index.html\` entry point, with the two original prototypes preserved.
- Added a separated question bank and application logic for easier maintenance.
- Defined four levels, mixed/topic-filtered sessions, practice and exam modes, optional timing, answer shuffling, review flags, topic breakdowns, downloadable review, and local progress.
- Added new SRE, observability, Linux/system, and networking questions and explanations.
- Added a README, question-bank validation script, and GitHub Actions workflow.

## Next priorities

### P0 — Quality and correctness
- Review every legacy question for correctness, ambiguity, outdated commands, and distractor quality.
- Add source references/version notes for questions where Kubernetes, AWS, Terraform, or observability behaviour changes over time.
- Add browser-level smoke tests for setup, scoring, timer expiry, review filtering, and persistence.
- Improve question metadata (subtopic, source, last reviewed, practical vs conceptual).

### P1 — Coverage depth
- Kubernetes: scheduling, requests/limits, probes, RBAC, NetworkPolicy, DNS, CNI, CSI, admission, upgrades, etcd, debugging Pending/CrashLoopBackOff/ImagePullBackOff.
- Docker/container runtime: namespaces/cgroups, image layers, BuildKit, registries, supply-chain scanning, rootless mode, Compose and runtime troubleshooting.
- AWS: IAM policy evaluation, VPC routes, endpoints, NAT, load balancers, autoscaling, EKS, CloudWatch, KMS, backups, multi-account design and cost.
- Terraform: state recovery, locking, imports/moved blocks, drift, provider constraints, module design, lifecycle, workspaces versus separate state, policy checks and safe apply.
- Linux and systems: systemd dependencies, cgroups, OOM, I/O pressure, filesystems/inodes, limits, boot, kernel logs, package management, patching, hardening and configuration drift.
- Ansible: precedence, handlers, tags, check mode caveats, vault, dynamic inventory, roles, collections, delegation, rolling changes and idempotency.
- Observability: RED/USE, SLI design, PromQL, histograms, cardinality, OpenTelemetry, sampling, alert routing, black-box probes and dashboard design.
- SRE: error-budget policies, burn-rate alerts, incident roles, postmortems, capacity, toil, dependency failure, graceful degradation, RTO/RPO and disaster recovery.

### P2 — Better learning loops
- Missed-question queue and spaced repetition.
- Explanations that distinguish why distractors are wrong.
- Confidence ratings, bookmarks across sessions, and mastery tracking by subtopic.
- Exam blueprint presets for named certifications, checked against current official objectives.
- Optional flashcards, command-line labs, architecture exercises, and incident simulations.

### P3 — Platform and community
- Contribution guide, issue templates, review standards, and an explicit license.
- Question linting for duplicate wording, repeated options, answer-position bias, and unsupported claims.
- A maintainable test suite and accessible browser testing.
- Optional hosted deployment and account-backed progress sync only if users need it.

## Success criteria

- No duplicate questions within one quiz attempt.
- Every question has four distinct choices and a valid correct index.
- Every question has a clear explanation or an explicit editorial exception.
- Each level tests a distinct depth of reasoning, not merely a different label.
- Score breakdowns help learners choose the next topic.
- Questions are version-aware and reviewed against primary documentation.
