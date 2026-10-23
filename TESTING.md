# Browser test plan

The browser suite uses Python's Playwright client and Chromium against the same static HTTP server style used for local development. CI runs it after the JavaScript syntax and question-bank checks.

Run locally after installing Playwright and its Chromium browser:

```sh
python -m pip install playwright
python -m playwright install chromium
python -m unittest discover -s tests -v
```

## Coverage

| Area | Test coverage |
|---|---|
| App startup | Content loads over HTTP and setup is visible |
| Mode selector | Learn, Practice, Exam simulation, and Interview update the selected state |
| Mode question pools | Counts and question-title sets are compared for all four modes |
| Learn and Practice feedback | Submitting an answer reveals explanation and feedback |
| Exam simulation | Timer defaults on, answer feedback stays hidden during the session, results show after finishing |
| Difficulty/type filters | Available counts and empty type handling update when filters change |
| Multi-select | Empty submission is blocked and correct choices are shown after submission |
| Interview | Empty response is blocked; notes, checklist, rating, and ungraded result work |
| Navigation | Previous/next, jump list, save-for-review, and keyboard answer shortcut work |
| Results and history | Finish, reset, clear history, and recent-session counters work |
| Roadmap | Both roadmap toggle buttons open and close the panel |
| Export | Session review exports a text file |

## Current baseline finding

At the default Easy / Kubernetes filter, the bank contains seven questions: six scored questions and one open-ended interview prompt. Learn and Practice currently select the same seven-question pool; Exam selects the same six scored questions, and Interview selects the one interview prompt. The tests record this pool overlap explicitly because it explains why switching modes can show the same questions. It is not a randomisation failure.

The suite verifies the current behavior of the modes; it does not claim that the overlap is the ideal learning design. A follow-up behavior change should define the intended distinction between Learn and Practice, then update the relevant assertions.

## Limits

These are automated interaction tests, not a full manual usability or accessibility audit. They do not verify every viewport size, browser engine, screen reader, or the live Pages deployment. A green CI run means the listed Chromium workflows passed on that commit.


## Multi-subject regression coverage

Run `node scripts/validate-subjects.js` and `python3 scripts/build-subject-packs.py --check` in addition to the original checks. The catalog gate validates all 11 manifest entries, 1,020 scored items, 330 interviews, 330 lessons, 132 command guides and 110 scenarios, cross-pack ID uniqueness, per-subject prompt uniqueness, reference host allowlists and answer shape. Reproducibility checks do not write generated output.

The Chromium suite additionally covers all ten new subjects in Learn/Practice/Exam/Interview, exact available counts, subject-card search, learning search and subject isolation, partial and total pack-download failure with recovery, unavailable browser storage, and 390px mobile overflow. Existing tests cover scoring modes, multi-select interaction, saved review, timers, navigation and exports.

Both validation and deployment workflows run the browser suite. The Pages workflow publishes all JSON packs after its checks pass. A local environment without Chromium can still run static/content checks, but should not claim browser validation; use the Actions results before publishing.

The browser suite checks every subject in every library module, circular icon selection, the rendered README destination, roadmap viewport/focus, and mobile detail navigation. Existing scored-mode, storage and failed-fetch regressions remain.
