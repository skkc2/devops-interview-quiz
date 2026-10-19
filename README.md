# OpsLab — DevOps & SRE Learning Studio

A free, browser-based learning and interview-practice app for DevOps, platform engineering, cloud infrastructure, systems administration and Site Reliability Engineering.

The first curated learning track is **Kubernetes**. The app is intentionally static: HTML, CSS, JavaScript and JSON, hosted on GitHub Pages. No framework, build step, account, backend or API key is required.

## Start locally

Because the app loads its curated question bank as JSON with fetch, serve the repository over HTTP instead of opening index.html as a file URL.

    python3 -m http.server 8000

Open http://localhost:8000.

## Learning modes

- **Learn** — guided questions with explanations, a key takeaway and official references.
- **Practice** — immediate answer feedback and a chance to correct misconceptions.
- **Exam simulation** — optional timer and no in-question explanations; review answers at the end.
- **Interview** — open-ended prompts, an example answer, a self-review checklist and follow-up questions. These prompts are not automatically scored.

## Question design

The Kubernetes track starts with 28 curated questions, seven per difficulty:

- **Easy** — foundational objects, commands, probes and configuration.
- **Medium** — operational diagnosis, logs, resource semantics and rollbacks.
- **Medium hard** — rollout decisions, scheduling, disruption budgets and autoscaling.
- **Hard** — node pressure, network policy, availability trade-offs and production incident leadership.

Question types are **concept**, **command interpretation**, **troubleshooting scenario**, **multi-select**, **trade-off/design**, and **open-ended interview**. Every curated item includes a learning objective, explanation, takeaway and at least one link to official Kubernetes documentation. Interview prompts also include a sample answer, answer checklist and follow-up questions.

The older question bank is retained for breadth across Linux, AWS, Terraform, Docker, Ansible, Git, networking, systems administration, observability and SRE. Legacy questions have lighter explanations; they should be curated subject-by-subject rather than bulk-expanded without review.

## Architecture

The content model, eight learning modules, subject-pack layout, session rules and acceptance criteria are documented in [ARCHITECTURE.md](ARCHITECTURE.md). The current app implements the learning destinations and session foundations; the curated question bank and broader subject content are still being expanded.


    index.html                         App shell and accessible UI
    styles.css                         Responsive design and interaction states
    app.js                             Session engine, filters, feedback and local progress
    questions.js                       Legacy multi-subject question bank
    data/kubernetes.json               Curated Kubernetes graded questions
    data/kubernetes-learning.json      Kubernetes lessons, commands and debugging guides
    scripts/validate-question-bank.js  Graded question schema and editorial checks
    scripts/validate-learning-content.js Learning content schema and reference checks
    tests/test_app.py                 Chromium browser interaction tests
    TESTING.md                        How to run tests and coverage notes
    .github/workflows/validate.yml     CI validation and browser tests
    .github/workflows/deploy-pages.yml GitHub Pages deployment

- **Static hosting:** GitHub Pages serves the files directly; no server-side runtime.
- **Question content:** subject-specific JSON, separate from the quiz engine.
- **Progress:** localStorage in the current browser only. It is not synced across devices or accounts.
- **Validation:** Node.js checks JavaScript syntax, question schema, answer indexes, duplicate prompts, level coverage and official reference URLs.
- **Deployment:** the Pages workflow deploys from main after validation succeeds.

## GitHub Pages setup

1. Merge the reviewed pull request into main.
2. Open **Settings → Pages** in the repository.
3. Under **Build and deployment → Source**, select **GitHub Actions**.
4. Check the **Actions** tab for the Deploy OpsLab to GitHub Pages workflow.
5. Once deployment succeeds, use the site URL shown in the github-pages environment.

The expected project-site URL is https://skkc2.github.io/devops-interview-quiz/. GitHub Pages may take a few minutes to publish after the first deployment.

## Validate locally

Install Node.js 20 or later, then run:

    node --check app.js
    node --check questions.js
    node scripts/validate-question-bank.js
    node scripts/validate-learning-content.js
    python -m pip install playwright
    python -m playwright install chromium
    python -m unittest discover -s tests -v

The CI workflow runs the syntax and content checks plus the Chromium interaction suite on pushes and pull requests. A passing schema check does not replace editorial review or a live Pages smoke test.

## Contributing high-quality questions

Prefer small, reviewable PRs focused on one subject.

1. Define the competency being tested and its intended difficulty.
2. Use plausible distractors based on real misconceptions, not joke answers.
3. Include a concise explanation of why the answer is correct and why the tempting alternatives fail.
4. Link primary documentation, and note version-specific behaviour where it matters.
5. For scenarios, ask for the next useful diagnostic step and explain the evidence it provides.
6. For interview prompts, provide a strong example answer, a checklist and follow-up prompts. Do not pretend open-ended answers have an objective numeric score.
7. Run validation and manually test desktop, mobile, keyboard navigation, feedback and review.

## Scope and limitations

This is a study aid, not an official certification simulator or a guarantee of passing an exam. Difficulty labels are pedagogical, not official exam levels. Pair practice with hands-on labs, the current exam objectives and primary documentation.

Progress remains in local browser storage. Clearing browser data removes it. Do not enter production secrets or sensitive incident data into answer notes.

## License

No license file was present in the original repository. Add an explicit license if you want to grant users clear reuse and contribution permissions.
