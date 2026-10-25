# OpsLab — DevOps & SRE Learning Studio

A free static learning and interview-practice app for DevOps, platform engineering, cloud infrastructure, systems administration and SRE. Runs on GitHub Pages with no account, backend, API key, framework or build step.

**[Open OpsLab](https://skkc2.github.io/devops-interview-quiz/)**

## Start with one useful session

1. Open the live app and choose a subject.
2. Use **Learn** to study a concept or interpret a command.
3. Switch to **Practice**, choose a difficulty and answer a short set with explanations.
4. Save difficult questions for review, or use **Interview** to rehearse an answer aloud.

**At a glance:** 11 subjects · 1,020 scored questions · 330 interview prompts · 330 concepts · 348 command/query guides · 110 worked troubleshooting cases.

## Release status: public beta

The app is published on GitHub Pages. The latest functional release passed 28 Chromium browser tests, content validation and reproducible content generation. Tests cover session behavior, question visibility, learning modules, mobile layouts and failure paths.

This is ready for public feedback as a learning tool. It is not a claim of exhaustive content accuracy, interview outcomes, certification alignment or compatibility with every platform. Further release work includes independent subject-matter review, Safari/Firefox coverage and manual keyboard/screen-reader checks. Browser storage is local to this device and may be cleared by the browser or user.

## Subjects and question counts

| Subject | Scored questions | Self-reviewed interviews | Total |
| --- | ---: | ---: | ---: |
| Kubernetes | 120 | 30 | 150 |
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
| **Total** | **1,020** | **330** | **1,350** |

Each new subject contains **30 competency sets**. A set deliberately reinforces a topic through a concept question, a troubleshooting scenario, a two-answer multi-select check and an open-ended interview prompt. These are related exercises, not 120 independent competencies. Each has an explanation, takeaway and primary reference. Interview prompts include an answer outline, checklist and follow-up; they are never automatically scored.

The four difficulty bands progress from foundations to operational trade-offs. New packs contain 32 easy, 32 medium, 32 medium-hard and 24 hard items, including interviews. Difficulty is pedagogical, not an official certification level.

## Learning experience

- Compact circular subject icons with accessible labels, keyboard focus and direct subject selection. The catalog shows total scored/interview counts; session setup shows the selected subject counts.
- **Learn:** every subject has 30 core concepts, 24–40 command/query guides, 10 worked scenarios and 30 interview prompts. Search the library and switch subjects without returning to setup.
- **Practice:** randomized questions and answer ordering, immediate explanations, keyboard shortcuts and saved review.
- **Exam:** scored items only; optional timer and explanations withheld until review.
- **Interview:** written notes, answer outlines, checklists and self-ratings without a fabricated score.
- Concepts explain **what it is** and **how it works**, with related commands where useful. Command guides explain **what**, **why**, flags/output interpretation and execution context. **Scenarios & debugging** is one module with diagnosis, fix and recovery verification. Interview prompts include answer guidance and follow-ups; they are original practice material, not attributed employer questions.
- Progress and bookmarks stay in local browser storage. No cross-device synchronization.
- A failed subject download produces a visible warning while other subjects remain usable. Content requests revalidate cached JSON so a new Pages release can refresh existing clients.

The original `questions.js` bank is retained as an archive and validated for compatibility, but is no longer loaded into active sessions. Existing curated Kubernetes question IDs remain unchanged. Old legacy bookmarks are not migrated into the new packs.

The library totals **330 concepts, 348 command/query guides and 110 worked troubleshooting cases**. These cover a core curriculum, not every possible command or product feature. Command output is illustrative; replace placeholders and check the documented environment before use.

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
data/<subject>-learning.json      Authored concepts, command guides and incident walkthroughs
content/<subject>.txt              Authored competency source for the ten new packs
content/references.json            Competency-specific primary-reference overrides
content/library/                   Authored learning and interview sources for all subjects
content/kubernetes-bank.json       Preserved Kubernetes scored bank and original interview items
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

After editing authored content, run `python3 scripts/build-subject-packs.py` and commit both source and generated JSON. `--check` verifies that committed JSON exactly matches its source without writing files. All learning content is authored in `content/library/`; the preserved Kubernetes question source is `content/kubernetes-bank.json`. See [the library content guide](content/library/README.md).

Schema checks verify structure, counts, answer indexes, duplicate prompts within each subject, difficulty coverage and approved reference hosts. They do not establish editorial correctness or guarantee every linked page remains available. Review meaning, distractors and version-specific behavior against the primary references when changing content.

## GitHub Pages

Keep **Settings → Pages → Source** set to **GitHub Actions**. The deployment workflow runs content validation, source consistency checks and the Chromium suite before publishing. It copies every `data/*.json` pack so additions are not silently omitted. No server-side runtime is required.

The expected site is https://skkc2.github.io/devops-interview-quiz/. Use the deployment environment and Actions result to confirm publishing, rather than assuming a pushed commit is already live.

## Scope

This is a study aid, not an official certification simulator. Pair exercises with hands-on labs and version-appropriate documentation. Clearing browser storage removes local progress. Do not enter production secrets or sensitive incident data into notes.

## License

A reuse license has not yet been selected. Public access to this repository should not be interpreted as a blanket license to redistribute its code or content. External documentation and trademarks remain subject to their owners' terms.

## Help improve OpsLab

Found an unclear question, incorrect answer or command that behaves differently on your platform? [Open an issue](https://github.com/skkc2/devops-interview-quiz/issues/new) with:

- The subject, question or guide title, and the exact wording involved.
- Expected versus observed behavior, including relevant tool versions.
- A primary documentation reference and a proposed correction where possible.

For interface problems, include browser, screen size and steps to reproduce. Remove credentials, private infrastructure details and personal data from reports.

Content contributions should improve reasoning and operational relevance, rather than simply increase counts. Read [the content guide](content/README.md), run the validation commands above and include both source and generated changes. Changes to reviewed question wording also require updating its review record in `content/review/question-audit.json`.

If OpsLab helps you, share a specific learning example with a colleague, link to the live app, or star the repository so you can find it again.

### Practice question clarity and command coverage

Practice, exam and interview sessions display the actual question, with operational context above the specific ask. Short topic titles are only catalog labels. Multi-select prompts state the required answer count; review cards and exported notes retain the full prompt.

The wording review covers all 1,350 active items: 1,250 revised prompts and 100 retained Kubernetes prompts that already stated a specific situation and task. Question IDs and answer mappings are preserved. Authored contexts and the per-question review inventory live in `content/review/`.

Command coverage is 40 each for Kubernetes, Linux and Networking; 30 each for AWS, Terraform, Docker, Ansible, Git & CI/CD and Systems administration; and 24 operational command/query guides each for SRE and Observability. These are curated workflows, not an exhaustive listing of every flag. Each guide explains purpose, output, prerequisites and whether the operation changes state.
