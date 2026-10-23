# Learning-library source

Content was drafted for every subject before the UI integration. The source is intentionally independent of page rendering.

Each of the eleven subjects has:

- 30 concept lessons: a definition, an explanation of behavior, and an optional related command.
- 12 core command/query guides: what it is, why to use it, flag/output interpretation, illustrative output, and execution context.
- 10 worked troubleshooting cases: symptom, diagnostic evidence, conditional fix, and recovery verification.
- 30 interview questions with a follow-up and answer guidance. These are original practice questions modeled on practical interview competencies, not claims about questions asked by a named employer.

This is a core curriculum, not an exhaustive reference for every command or every product feature. Commands use uppercase placeholders where substitution is required. Outputs are illustrative. PromQL examples explicitly document their assumed metrics, labels and populations. SRE and observability include operational tools rather than inventing a product-specific CLI.

## Source format

UTF-8, one item per line. `|` separates fields and must not appear within a field.

- `.concepts`: title | what it is | how it works | optional command
- `.commands`: title | command or query | what it is | why to use | how to read | illustrative output | prerequisites and effects
- `.scenarios`: title | symptom | optional diagnostic command | diagnosis | fix | verification
- `.interviews`: question | follow-up

Existing competency sources in `content/*.txt` retain the 90 scored questions per added subject and supply context for interview answers. Kubernetes retains its 120 scored questions and four established interview IDs from `content/kubernetes-bank.json`; 26 additional questions complete its 30-question interview set. Four overlapping draft prompts are omitted from publication rather than duplicating those existing questions.

`python scripts/build-subject-packs.py` builds all runtime JSON. `--check` detects source/output drift. Content validation checks every subject and all module types. References link to primary documentation; platform and version differences still matter when executing commands.
