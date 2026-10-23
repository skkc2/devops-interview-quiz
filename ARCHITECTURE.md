# OpsLab learning platform architecture

**Status:** Proposed architecture for the next implementation stages
**Scope:** Content model, session rules, navigation contract, quality gates and delivery sequence. This document does not yet change the runtime UI or bulk-add content.

## 1. Product model

OpsLab should be a subject-first learning studio. A learner selects a technology, then a learning path, then relevant modules and a session size. A mode must change the *activity and feedback*, not merely change a label on the same question list.

### Four learning paths

| Path | Purpose | Content shown | Feedback |
|---|---|---|---|
| **Learn** | Build understanding | Structured concepts, diagrams/mental models, examples, command explainers and references. No forced quiz-first flow. Optional knowledge checks follow the lesson. | Explanations are visible; learner can mark a lesson understood or revisit it. |
| **Practice** | Develop recall and problem-solving | Graded questions drawn from the selected subject, difficulty, topic and type. User-selected count is exact when enough eligible questions exist. | Explain the answer after submission, with why distractors are wrong and a practical takeaway. |
| **Exam simulation** | Measure readiness | Exam-like graded questions, no hints/explanations before submission, optional timer, progress indicator and end-of-session review. | Score and breakdown appear after finishing; explanations appear in review. |
| **Interview** | Practice communicating engineering judgement | Open-ended prompts, incident narratives, design/trade-off prompts, sample answer structure, checklist and follow-ups. | Self-assessment and notes; never imply open-ended answers are objectively auto-scored. |

## 2. The eight clickable learning modules

The four path cards should lead to eight real destinations. These are not decorative labels; each tile opens a filtered view with content, a count, and a useful empty state.

1. **Concepts** — definitions, purpose, mental model, lifecycle, relationships, common misconceptions and examples.
2. **Commands** — runnable command or configuration snippet, prerequisites, expected output, interpretation, safe-use notes and a related concept.
3. **Scenarios** — symptoms, context, constraints, plausible next steps, evidence to collect and reasoned solution.
4. **Debugging** — symptom-to-hypothesis workflow, diagnostic command, what evidence confirms/refutes, root cause and remediation.
5. **Timed drills** — exam-style question sets with exact chosen count, timer and no in-question explanations.
6. **Review queue** — saved, missed and low-confidence items; filters and a retry action that targets selected items.
7. **Interview prompts** — open-ended prompts, answer framework, model answer, checklist and follow-up questions.
8. **Follow-ups** — progressive interviewer probes linked to the parent prompt, sample answer and competency checklist.

## 3. Technology subjects

Each subject uses the same schema and interaction engine but has a subject-specific content pack. Initial subject catalogue:

- Kubernetes
- Linux and systems administration
- Docker and containers
- AWS
- Terraform
- Ansible
- Networking
- Observability
- Site Reliability Engineering (SRE)
- Git and CI/CD

Subject-specific modules can add tags, version metadata and lab prerequisites without changing the app engine. A subject is not shown as complete until its content pack passes validation and has a reviewed minimum inventory.

## 4. Content architecture

Keep content out of UI code. Use one manifest for subject metadata and separate subject pack files for lessons, commands, questions, scenarios and interview prompts. Keep IDs stable so saved items and progress can refer to content safely.

Suggested structure:

```text
index.html
styles.css
app.js                         # routing/rendering and UI event handlers
src/
  catalog.js                   # subject and module registry
  content-loader.js            # fetch, validate shape, filter content
  session-engine.js            # selection, scoring, timer and review rules
  progress-store.js             # versioned localStorage adapter
data/
  catalog.json                 # subjects and the eight module definitions
  kubernetes/
    lessons.json
    commands.json
    questions.json
    scenarios.json
    interview.json
  linux/
    lessons.json
    commands.json
    questions.json
    scenarios.json
    interview.json
schemas/
  lesson.schema.json
  command.schema.json
  question.schema.json
  scenario.schema.json
  interview.schema.json
scripts/
  validate-content.js
tests/
  test_app.py                  # browser integration tests
  content-contract.test.js     # content counts, filters and session selection
.github/workflows/
  validate.yml
  deploy-pages.yml
```

This is a target structure, not an instruction to move every existing file in one risky PR. Migrate incrementally and keep the current GitHub Pages static-hosting constraint: no backend, secrets or server runtime required.

## 5. Shared content contracts

### Lesson

- `id`, `subject`, `topic`, `title`, `summary`, `objectives`, `prerequisites`
- `sections`: explanation, examples, common mistakes and practical takeaway
- `relatedCommands`, `relatedQuestions`, `references`, optional `versionScope`

### Command

- `id`, `subject`, `topic`, `title`, `purpose`, `command` or `snippet`, `shell`/`language`
- `prerequisites`, `expectedOutput`, `interpretation`, `safetyNotes`, `commonVariants`, `relatedLesson`, `references`
- Commands must be technically valid for the named environment; destructive commands must be clearly labelled and use safe examples.

### Graded question

- `id`, `subject`, `topic`, `difficulty`, `type`, `objective`, `prompt`
- `options`, `correctAnswers` or a clearly defined response evaluator for objectively gradable formats
- `explanation`, `distractorRationales`, `takeaway`, `references`, optional `versionScope`
- Do not put interview prompts in the graded pool. Multi-select must identify every correct option and explain why.

### Scenario / debugging case

- `id`, `subject`, `topic`, `difficulty`, `scenario`, `constraints`, `signals`
- `steps`: diagnostic action, evidence expected and how that evidence changes the next step
- `rootCause`, `remediation`, `prevention`, `references`

### Interview prompt

- `id`, `subject`, `topic`, `difficulty`, `prompt`, `answerFramework`, `sampleAnswer`
- `checklist`, `followUps`, `selfRatingScale`, `references`

## 6. Question inventory and counts

Practice and Exam must select from the same reviewed graded-question catalogue, but apply different session/feedback rules. Learn selects lessons and commands, not just quiz items. Interview selects interview prompts only.

Minimum target for each subject's graded bank:

| Difficulty | Minimum reviewed questions |
|---|---:|
| Easy | 30 |
| Medium | 30 |
| Medium hard | 30 |
| Hard | 30 |
| **Total per subject** | **120** |

With ten subjects, the eventual baseline is 1,200 graded questions. Lessons, commands, scenarios and interview prompts are separate inventory, not counted toward those 120. A subject should not be marked complete by duplicating prompts, lightly rewording the same question, or filling levels with trivia.

Question count behavior:

- User selects 5: start with 5 eligible unique questions.
- User selects 10: start with 10 eligible unique questions.
- User selects 30: start with 30 eligible unique questions.
- User selects all: use all eligible unique questions.
- If filters leave fewer questions than requested, show the available count and ask the learner to broaden filters or explicitly accept the smaller set. Never silently cap at five or six.
- Display available eligible count after every subject, difficulty, topic and type change.
- No duplicates in a session. Randomize within the eligible pool; keep reproducible selection available in tests.
- Interview and Learn counts apply to their own content types and should not be misleadingly labelled as graded-question counts.

## 7. Taxonomy and filtering

Every item should carry a stable subject and topic plus a compatible module/type tag. Core question types include `concept`, `command`, `scenario`, `debugging`, `multi_select`, `tradeoff`, and `interview`. UI labels are human-readable; internal keys remain stable.

Filters are composable. Subject changes reset incompatible topics; difficulty applies to graded questions and scenarios where defined; type filters show only supported types. A filter with zero matches must display a useful empty state and a clear reset action. A tile click should navigate to the relevant module and pre-apply its filters.

## 8. Navigation and interaction contract

- Every visible link, button, tile and toggle has an implemented action and a browser test.
- The roadmap link opens a real roadmap destination or a working in-page panel with a correct anchor. No `href="#"` dead links.
- The eight module tiles open real views and show content/counts or an honest empty state.
- The selected subject, path, topic, difficulty, type and count are visible in the session summary.
- Browser Back/Reset behavior is predictable; restarting or exiting a session requires confirmation only when progress would be lost.
- Keyboard focus, visible focus styles, labels and mobile layouts are part of acceptance testing.

## 9. Progress storage

Use a versioned localStorage shape keyed by stable content IDs: saved IDs, missed IDs, confidence ratings, completed lessons and session summaries. Add migration/default handling and tolerate malformed or unavailable storage. Explain that progress is browser-local and not synced.

## 10. Quality gates

Automated validation must verify:

- Schema and required fields per content type.
- Exactly the required minimum count for a subject before it is declared complete: 30 unique graded questions per difficulty.
- Unique stable IDs and no duplicate/near-duplicate prompts within a subject.
- Correct answer indexes, distinct options and valid multi-select answer sets.
- Explanation, distractor rationales, takeaway and primary references for graded items.
- Commands include environment, expected result and safety notes where relevant.
- Interview prompts have a checklist and model answer but are not placed in auto-scored question pools.
- Filter combinations, selected question counts, no-duplicate sessions and graceful insufficient-pool handling.
- All visible controls have browser tests; roadmap/module navigation is tested by clicking through it.
- GitHub Pages artifact contains only intended publishable files.

Passing structural tests is necessary but not sufficient. Each subject bank also needs technical/editorial review against primary documentation and a browser-level review of the learner journey.

## 11. Incremental delivery plan

1. **Architecture contract (this PR):** agree on the content model, paths, eight modules, count rules and acceptance criteria.
2. **Session engine and navigation:** repair filtering/count calculation, add the eight destinations, fix roadmap navigation and enforce the mode contract against the existing Kubernetes pack.
3. **Kubernetes content pack:** expand to 120 unique graded questions (30 per difficulty), plus separate reviewed lesson and command inventories and scenario/interview material.
4. **Subject pack template and validation:** enforce the content contracts and inventory requirements in CI.
5. **Subject-by-subject content packs:** Linux, Docker, AWS, Terraform, Ansible, Networking, Observability, SRE, and Git/CI-CD. Each gets its own PR and validation report.
6. **Visual refinement:** redesign the page around the validated information architecture, then verify every control with browser tests and responsive/accessibility checks.
7. **Repository cleanup:** remove obsolete prototypes only after confirming no workflow or documentation relies on them.

## 12. Definition of done

- Learn opens lessons/concepts and command explainers, not a small quiz disguised as learning.
- Practice and Exam respect the selected subject, filters and requested count; the UI never silently limits a session to five or six.
- Exam hides explanations until review; Practice explains immediately after each answer.
- Interview prompts remain open-ended and support useful self-assessment.
- All eight module destinations and the roadmap work by mouse and keyboard.
- Every completed subject meets the 120-question minimum and passes content validation plus editorial review.
- The full Playwright suite passes on the PR, and the published GitHub Pages site is smoke-tested after deployment.

## Multi-subject implementation addendum (October 2026)

The runtime now loads `data/subjects.json`, then independently loads each subject's question and learning packs. Eleven subjects are active. New packs contain 30 competency sets: 90 scored questions plus 30 self-reviewed interviews, with 30 short lessons each. Kubernetes retains its 120 scored questions and four interviews. Related variants reinforce a competency; counts are not counts of independent competencies.

The subject catalog and learning-library subject selector use loaded manifest entries. Every learning item is assigned its pack subject at load time; the old Kubernetes topic shortcut is removed so a Kubernetes filter cannot expose other subjects. Search is local to the selected learning module. Partial download failures exclude the failed pack and display a warning; total failure leaves the start action disabled with reload recovery.

The legacy bank remains archived but is not included in runtime pools. Session scoring, option shuffling, review, export and existing Kubernetes identifiers remain intact. All scored modes exclude interview prompts. All eleven subjects now have authored concept, command and incident content. The UI combines scenarios and debugging; the JSON key `debugging` remains for compatibility and holds the worked scenarios.

`content/` and `scripts/build-subject-packs.py` provide reproducible editorial source for the ten new tracks. CI checks source/output consistency and full catalog invariants. Pages copies every JSON pack and runs browser regressions before deployment.

### Authored library integration

`content/library/<subject>.{concepts,commands,scenarios,interviews}` is compiled before publishing. The compiler preserves the established Kubernetes scored bank and four original interview IDs, adding 26 interview prompts. Lessons use definition/mechanism sections, command guides expose interpretation and prerequisites, and incident steps separate diagnosis, fix and verification. Static inline SVG pictograms require no external image requests. JSON fetches revalidate cache entries to avoid stale content after deployment.
