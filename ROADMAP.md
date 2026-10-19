# OpsLab roadmap and quality bar

## Current PR: learning UI + Kubernetes track

- Replace the old quiz-first landing page with a responsive learning studio.
- Add distinct Learn, Practice, Exam Simulation and Interview flows.
- Support concept, command, troubleshooting scenario, multi-select, trade-off/design and open-ended interview questions.
- Keep curated Kubernetes content in a dedicated JSON file with learning objectives, explanations, takeaways and official references.
- Add self-review for interview prompts without pretending those answers are objectively scored.
- Add question schema validation and a GitHub Pages deployment workflow.
- Preserve the original HTML prototypes and the legacy question bank for reference.

## Subject-by-subject content plan

Each subject should arrive in its own focused PR. Do not expand a topic just to hit a question-count target.

1. **Kubernetes** — workload controllers, probes, services, scheduling, resources, rollouts, security, networking, disruption handling and incident diagnosis. Initial curated track: 28 questions across four levels and six question types.
2. **Linux and systems administration** — processes, systemd, memory, filesystems, permissions, networking tools, logs, resource pressure and a repeatable troubleshooting method.
3. **Docker and containers** — image layers, build caching, namespaces/cgroups, storage, networking, signal handling, health checks and image supply-chain basics.
4. **AWS** — IAM policy evaluation, VPC routing, security groups/NACLs, load balancing, DNS, compute/storage failure modes and least-privilege design.
5. **Terraform** — state and locking, plan review, drift, imports, modules, provider constraints, lifecycle, secrets and safe recovery from failed applies.
6. **Ansible** — idempotency, inventory precedence, variables, handlers, roles, secrets, check mode and safe rollout strategies.
7. **Networking** — DNS, TCP, TLS, routing, NAT, MTU, HTTP, packet-level diagnosis and service-to-service failure isolation.
8. **Observability** — metrics/logs/traces, cardinality, percentiles, alert quality, dashboards and telemetry design.
9. **SRE** — SLIs/SLOs, error budgets, burn rate, incident command, postmortems, capacity and reliability trade-offs.
10. **Git and CI/CD** — history, branching, pipelines, artifacts, deployment strategies, rollback and supply-chain controls.

## Editorial quality gate

A subject PR should aim for 25–40 genuinely useful questions across levels and multiple question types, but quality wins over count. Every curated question should have:

- A clear learning objective and one unambiguous expected answer for automatically graded items.
- Plausible, distinct distractors and no accidental clues from answer length or grammar.
- A substantive explanation, practical takeaway and primary-source reference.
- A difficulty justified by reasoning depth, not obscure trivia.
- A scenario that asks for evidence, prioritisation or trade-offs rather than guessing a magic command.
- An open-ended interview prompt with a model answer, checklist and useful follow-ups.
- Automated schema checks and a manual review of technical correctness and current documentation.

## Later engineering work

- Add automated browser tests for keyboard flows, multi-select, timers, review filters, export and narrow screens.
- Improve accessibility audits and test with screen readers.
- Add version metadata to questions where Kubernetes or cloud behaviour differs by version.
- Add spaced repetition and a persistent missed-question practice queue.
- Review legacy questions subject-by-subject and retire inaccurate or trivial items.
- Add a contribution guide, issue templates and an explicit license.

## Success criteria

- A learner can tell the difference between Learn, Practice, Exam and Interview at setup and during the session.
- No question is duplicated within one session.
- Every graded question has distinct options and valid answer indexes.
- Interview prompts are self-assessed rather than auto-scored.
- Explanations, takeaways and primary references are available during review.
- Topic breakdowns lead to a sensible next study step.
- A pull request cannot pass CI with a malformed curated question bank.
