# DevOps & SRE Lab

A free, browser-based practice quiz for DevOps, platform engineering, cloud infrastructure, systems administration, and Site Reliability Engineering interviews.

**No build step, package manager, account, or server is required.** Open \`index.html\` in a modern browser, or serve the directory locally.

## What is in the repository today?

The project started as two standalone HTML prototypes:

- \`index-single-file.html\` — the original 210-question bank across Linux, Terraform, AWS, Ansible, Docker, Kubernetes, and Git, with three levels.
- \`devops-quiz-v2.html\` — a smaller 25-question quiz with explanations and a timer, but a very small question pool that could repeat questions.

Both prototypes are retained for reference. **\`index.html\` is the recommended entry point** for the consolidated experience. The new app reuses the legacy question bank and adds new material for SRE, observability, systems troubleshooting, and networking.

## Current features

- Four learning levels: **Easy, Medium, Medium hard, Hard**.
- Topic-specific or mixed-topic sessions.
- Practice mode with immediate explanations, or exam simulation with feedback at the end.
- Optional timer, randomized question order, and randomized answer order.
- Progress indicator, previous/next navigation, and save-for-review flags.
- End-of-session score, per-topic breakdown, missed-topic guidance, and answer review.
- Exportable text review and local browser history.
- Responsive layout, keyboard-friendly controls, and reduced-motion support.
- Question-bank validation script and GitHub Actions workflow.

Progress history uses browser \`localStorage\` on the device where the quiz is run. It is not an account-based sync system.

## Run locally

1. Download or clone this repository.
2. Open \`index.html\` directly in a modern browser.

Alternatively, run a local static server from the repository directory:

\`\`\`bash
python3 -m http.server 8000
\`\`\`

Then visit [http://localhost:8000](http://localhost:8000).

## Topics

| Topic | Examples of what to study |
| --- | --- |
| Kubernetes | Pods, workload controllers, Services, probes, scheduling, storage, debugging |
| Docker | Images, containers, builds, runtime behaviour, networking and storage |
| AWS | IAM, S3, EC2, VPC, load balancing, DNS, shared responsibility |
| Terraform | HCL, providers, modules, state, planning, lifecycle and safe changes |
| Linux and systems | Processes, memory, filesystems, permissions, systemd, logs and limits |
| Ansible | Playbooks, inventories, roles, idempotency, facts and Vault |
| Git and CI/CD | Branching, commits, history and delivery fundamentals |
| Networking | DNS, TCP, routing, HTTP, TLS, MTU, NAT and packet troubleshooting |
| Observability | Metrics, logs, traces, percentiles, cardinality, Prometheus concepts |
| SRE | SLIs/SLOs/SLAs, error budgets, burn rates, incident command, postmortems, recovery |

## Difficulty philosophy

- **Easy:** vocabulary, core concepts, common commands, and foundational service behaviour.
- **Medium:** day-to-day application, operational concepts, and interpreting common symptoms.
- **Medium hard:** multi-signal troubleshooting, trade-offs, and scenario-based operational reasoning.
- **Hard:** production incidents, failure containment, distributed systems, observability design, and senior-level decisions.

Difficulty is a learning aid rather than a universal certification scale. Certification exams change, differ by provider, and include practical objectives that a multiple-choice quiz cannot fully reproduce.

## Validate the question bank

Node.js 20 or newer is only needed to run the validation script; the quiz itself has no Node.js runtime requirement.

\`\`\`bash
node --check app.js
node --check questions.js
node scripts/validate-question-bank.js
\`\`\`

GitHub Actions runs these checks for pushes and pull requests.

## Add a question

Questions live in \`questions.js\`. Add them under a level and topic group using this shape:

\`\`\`js
{
  question: "A realistic, unambiguous question?",
  options: [
    "Plausible answer A",
    "Plausible answer B",
    "Plausible answer C",
    "Plausible answer D"
  ],
  correct: 1,
  explanation: "Explain why the answer is correct and clarify the key concept."
}
\`\`\`

- \`correct\` is a zero-based option index.
- Keep exactly four distinct options.
- Prefer scenario-based questions over trivia where possible.
- Make distractors plausible and explanations technically precise.
- Avoid outdated commands, provider-specific assumptions without context, and absolute claims where behaviour depends on version or configuration.
- Cite an official source or version note in the explanation for version-sensitive behaviour when practical.

## Roadmap

1. Expand question depth and coverage with reviewed, version-aware questions and references to official exam objectives.
2. Add more command-output interpretation and troubleshooting scenarios.
3. Add optional spaced repetition and a persistent missed-question practice queue.
4. Add accessible keyboard shortcuts, a stronger test suite, and automated checks for duplicate/ambiguous questions.
5. Consider a framework-backed app or hosted progress sync only if the project needs more than a static site.

## Limitations and learning advice

This project is an interview study aid, not an official exam simulator and not a guarantee of passing a certification. Question quality matters more than a large question count. Pair it with hands-on labs, reading primary documentation, explaining trade-offs aloud, and timed mock exams aligned to the specific certification you plan to take.

## License

No license file was present in the original repository. Add a license explicitly if you want to grant users clear reuse and contribution permissions.
