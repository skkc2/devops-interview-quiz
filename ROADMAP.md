# OpsLab roadmap

The target content and session architecture is documented in [ARCHITECTURE.md](ARCHITECTURE.md). The plan below should be interpreted in that order: establish the behavior contract, fix navigation/filter/session mechanics, then expand content subject by subject.

## Priority sequence

1. Architecture and content contract.
2. Repair Learn/Practice/Exam/Interview behavior, filters, requested question counts and the eight module destinations.
3. Expand Kubernetes to 120 unique graded questions: 30 each at Easy, Medium, Medium hard and Hard. Keep lessons, commands, scenarios and interview prompts in their own content collections.
4. Add schemas and CI rules that enforce content quality and minimum counts.
5. Deliver each additional subject pack in its own PR.
6. Redesign the page around working destinations and validated content.
7. Keep the repository clean as features evolve; the retired standalone prototypes are removed and Pages publishes only the app runtime plus linked project documentation.

## Subject-by-subject content plan

Each subject should arrive in its own focused PR. Do not expand a topic just to hit a question-count target. A subject is complete only when it has 30 unique, reviewed graded questions at each of the four difficulty levels, plus separate lesson/command/scenario/interview content as defined in ARCHITECTURE.md.

1. **Kubernetes** — workload controllers, probes, services, scheduling, resources, rollouts, security, networking, disruption handling and incident diagnosis.
2. **Linux and systems administration** — processes, systemd, memory, filesystems, permissions, networking tools, logs, resource pressure and repeatable troubleshooting.
3. **Docker and containers** — image layers, build caching, namespaces/cgroups, storage, networking, signal handling, health checks and image supply-chain basics.
4. **AWS** — IAM policy evaluation, VPC routing, security groups/NACLs, load balancing, DNS, compute/storage failure modes and least-privilege design.
5. **Terraform** — state and locking, plan review, drift, imports, modules, provider constraints, lifecycle, secrets and safe recovery from failed applies.
6. **Ansible** — idempotency, inventory precedence, variables, handlers, roles, secrets, check mode and safe rollout strategies.
7. **Networking** — DNS, TCP, TLS, routing, NAT, MTU, HTTP, packet-level diagnosis and service-to-service failure isolation.
8. **Observability** — metrics/logs/traces, cardinality, percentiles, alert quality, dashboards and telemetry design.
9. **SRE** — SLIs/SLOs, error budgets, burn rate, incident command, postmortems, capacity and reliability trade-offs.
10. **Git and CI/CD** — history, branching, pipelines, artifacts, deployment strategies, rollback and supply-chain controls.

## Editorial quality gate

- Every item has a stable ID, subject, topic and applicable module/type tags.
- Every graded question has a clear objective, valid answers, distinct plausible distractors, substantive explanation, distractor rationales, takeaway and primary reference.
- Difficulty reflects reasoning depth rather than obscure trivia.
- Scenarios ask for evidence, prioritisation and trade-offs rather than guessing a magic command.
- Commands state environment, purpose, expected output and safety considerations.
- Interview prompts have a sample answer, checklist and follow-ups; they are not objectively auto-scored.
- CI validates schemas, inventory counts, duplicate/near-duplicate prompts, filters, session counts and browser interactions.
- Technical/editorial review and a live browser smoke test are required in addition to passing CI.

## Later engineering work

- Version-aware content for technologies whose behavior changes by release.
- Spaced repetition and a focused missed-question queue.
- Accessibility audit including keyboard and screen-reader workflows.
- Retire legacy question content that is inaccurate, trivial or duplicated.
- Add contribution guidance and an explicit license.

## Success criteria

- A learner can tell the difference between Learn, Practice, Exam and Interview at setup and during a session.
- Learn opens theory/commands; Practice gives immediate feedback; Exam defers explanations until review; Interview supports structured self-review.
- The requested session count is honored or the UI explicitly explains that the current filters yield fewer eligible items.
- All eight learning modules and the roadmap are working destinations, not decorative text.
- No duplicate questions in one session; interview prompts are not auto-scored.
- Every completed subject meets the 120-question minimum and passes content and browser validation.
- GitHub Pages publishes only intended site files.
