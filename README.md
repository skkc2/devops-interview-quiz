# OpsLab — DevOps & SRE Learning Studio

A free static learning and interview-practice app for DevOps, platform engineering, cloud infrastructure, systems administration and SRE. Runs on GitHub Pages with no account, backend, API key, framework or build step.

**[Open OpsLab](https://skkc2.github.io/devops-interview-quiz/)**

## Subjects and question counts

| Subject | Scored questions | Self-reviewed interviews | Total |
| --- | ---: | ---: | ---: |
| Kubernetes | 120 | 4 | 124 |
| Linux | 90 | 30 | 120 |
| Networking | 90 | 30 | 120 |
| SRE & incident response | 90 | 30 | 120 |
| Systems administration | 90 | 30 | 120 |
| AWS | 90 | 30 | 120 |
| Terraform | 90 | 30 | 120 |
| Docker | 90 | 30 | 120 |
| Ansible | 90 | 30 | 120 |
| Git & CI/CD | 90 | 30 | 120 |
| Observability | 90 | 30 | 120 |
| **Total** | **1,020** | **304** | **1,324** |

Each new subject contains **30 competency sets**. A set deliberately reinforces a topic through a concept question, a troubleshooting scenario, a two-answer multi-select check and an open-ended interview prompt. These are related exercises, not 120 independent competencies. Each has an explanation, takeaway and primary reference. Interview prompts include an answer outline, checklist and follow-up; they are never automatically scored.

The four difficulty bands progress from foundations to operational trade-offs. New packs contain 32 easy, 32 medium, 32 medium-hard and 24 hard items, including interviews. Difficulty is pedagogical, not an official certification level.

## Learning experience

- Searchable subject catalog with separate scored/interview counts and saved-question counts.
- **Learn:** 306 short lessons across all subjects, with search and in-library subject switching.
- **Practice:** randomized questions and answer ordering, immediate explanations, keyboard shortcuts and saved review.
- **Exam:** scored items only; optional timer and explanations withheld until review.
- **Interview:** written notes, answer outlines, checklists and self-ratings without a fabricated score.
- Learning destinations include concepts, scenarios, interview prompts, follow-ups and saved review across subjects. Dedicated command guides (6) and debugging playbooks (3) currently cover Kubernetes; empty modules explain the available alternatives.
- Progress and bookmarks stay in local browser storage. No cross-device synchronization.
- A failed subject download produces a visible warning while other subjects remain usable.

The original `questions.js` bank is retained as an archive and validated for compatibility, but is no longer loaded into active sessions. Existing curated Kubernetes question IDs remain unchanged. Old legacy bookmarks are not migrated into the new packs.

## Run locally

Serve over HTTP because content is loaded with `fetch`:

```sh
python3 -m http.server 8000
```

Open http://localhost:8000. Project-relative asset paths also work under the GitHub Pages repository prefix.

## Content and architecture

```text
index.html                         Accessible app shell and subject catalog
styles.css                         Responsive layout and interaction states
app.js                             Catalog, learning, session and review engine
data/subjects.json                 Subject manifest used by the app and validation
data/<subject>.json               Questions, explanations and interview outlines
data/<subject>-learning.json      Lessons and available command/debugging guides
content/<subject>.txt              Authored competency source for the ten new packs
content/references.json            Competency-specific primary-reference overrides
scripts/build-subject-packs.py     Deterministic editorial compiler (not a site build)
scripts/validate-subjects.js       Whole-catalog schema, count and reference-host checks
tests/test_app.py                  Chromium interaction and failure-path regressions
.github/workflows/validate.yml     Validation and browser tests
.github/workflows/deploy-pages.yml Validated GitHub Pages publishing from main
```

See [content/README.md](content/README.md) for the source format and [TESTING.md](TESTING.md) for validation. [ARCHITECTURE.md](ARCHITECTURE.md) contains the original architecture and a current implementation addendum.

## Validate and edit

Node.js 20+ and Python 3.12 are used by CI:

```sh
node --check app.js
node --check questions.js
node scripts/validate-question-bank.js
node scripts/validate-learning-content.js
node scripts/validate-subjects.js
python3 scripts/build-subject-packs.py --check
python -m pip install playwright
python -m playwright install chromium
python -m unittest discover -s tests -v
```

After editing authored content, run `python3 scripts/build-subject-packs.py` and commit both source and generated JSON. `--check` verifies that committed JSON exactly matches its source without writing files. Kubernetes content is maintained directly in its existing JSON packs.

Schema checks verify structure, counts, answer indexes, duplicate prompts within each subject, difficulty coverage and approved reference hosts. They do not establish editorial correctness or guarantee every linked page remains available. Review meaning, distractors and version-specific behavior against the primary references when changing content.

## GitHub Pages

Keep **Settings → Pages → Source** set to **GitHub Actions**. The deployment workflow runs content validation, source consistency checks and the Chromium suite before publishing. It copies every `data/*.json` pack so additions are not silently omitted. No server-side runtime is required.

The expected site is https://skkc2.github.io/devops-interview-quiz/. Use the deployment environment and Actions result to confirm publishing, rather than assuming a pushed commit is already live.

## Scope

This is a study aid, not an official certification simulator. Pair exercises with hands-on labs and version-appropriate documentation. Clearing browser storage removes local progress. Do not enter production secrets or sensitive incident data into notes.

No license was present in the original repository; this change does not invent a licensing grant.
