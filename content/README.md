# Editing competency sets

Each UTF-8 `<subject>.txt` contains 30 manually authored, pipe-delimited rows. The fields are:

1. Competency title
2. Concept question
3. Correct factual statement
4. A second correct operational principle
5. First false misconception
6. Second false misconception
7. Concrete scenario
8. Correct next action
9. Incorrect action
10. Open-ended interview question

Do not put a literal pipe inside a field. Each row becomes four related exercises and one short lesson. The exercises deliberately reinforce one competency; do not describe them as four independent topics. The first eight sets are easy, the next eight medium, the next eight medium-hard and the final six hard. Review difficulty labels for suitability when editing.

`references.json` maps competency titles to primary documentation. The compiler uses a subject-level reference when no override exists. Prefer a more specific primary page when possible. Host validation is not a live link checker or factual review.

Run `python3 scripts/build-subject-packs.py`, then all validation and browser tests in the root README. Commit source and generated JSON together. `--check` is a read-only reproducibility gate. The browser loads JSON directly; Python is not required by visitors or by static hosting.

Editorial checks: verify both true statements, ensure both misconceptions are actually false in the specified context, make the scenario action defensible from the stated evidence, and avoid version-sensitive absolutes. Read the generated answer outline as well as the input row. Prefer targeted follow-up improvements over adding variants merely to increase counts.
