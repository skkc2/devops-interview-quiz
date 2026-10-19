const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const packPath = path.join(__dirname, "../data/kubernetes-learning.json");
const pack = JSON.parse(fs.readFileSync(packPath, "utf8"));
assert.equal(pack.subject, "kubernetes", "Learning pack subject must be Kubernetes.");
for (const key of ["lessons", "commands", "debugging"]) {
  assert.ok(Array.isArray(pack[key]), key + " must be an array.");
  assert.ok(pack[key].length > 0, key + " must contain real content.");
}

const ids = new Set();
function uniqueId(item, kind) {
  assert.ok(item.id && typeof item.id === "string", kind + " requires a stable id.");
  assert.ok(!ids.has(item.id), "Duplicate learning content id: " + item.id);
  ids.add(item.id);
}
function refs(item, kind) {
  assert.ok(Array.isArray(item.references) && item.references.length > 0, kind + " requires references.");
  for (const ref of item.references) {
    assert.ok(typeof ref.title === "string" && ref.title.trim(), kind + " reference requires a title.");
    assert.ok(typeof ref.url === "string" && /^https:\/\/kubernetes\.io\/docs\//.test(ref.url), kind + " reference must point to official Kubernetes docs.");
  }
}
for (const lesson of pack.lessons) {
  uniqueId(lesson, "Lesson");
  assert.ok(lesson.title && lesson.summary && Array.isArray(lesson.sections) && lesson.sections.length >= 2, lesson.id + " needs a title, summary and at least two lesson sections.");
  assert.ok(lesson.sections.every(s => s.heading && s.body && s.body.length > 30), lesson.id + " has an incomplete lesson section.");
  assert.ok(lesson.takeaway && lesson.takeaway.length > 20, lesson.id + " needs a practical takeaway.");
  refs(lesson, "Lesson " + lesson.id);
}
for (const command of pack.commands) {
  uniqueId(command, "Command");
  for (const field of ["title", "command", "purpose", "environment", "expectedOutput", "interpretation", "safety"]) {
    assert.ok(typeof command[field] === "string" && command[field].trim().length > 10, command.id + " needs " + field + ".");
  }
  refs(command, "Command " + command.id);
}
for (const playbook of pack.debugging) {
  uniqueId(playbook, "Debugging playbook");
  assert.ok(playbook.title && playbook.symptom && Array.isArray(playbook.steps) && playbook.steps.length >= 2, playbook.id + " needs a symptom and diagnostic steps.");
  assert.ok(playbook.steps.every(step => step.action && step.evidence && step.evidence.length > 20), playbook.id + " has an incomplete diagnostic step.");
  assert.ok(playbook.avoid && playbook.avoid.length > 20, playbook.id + " needs a caution.");
  refs(playbook, "Debugging playbook " + playbook.id);
}
console.log("Kubernetes learning pack validated: " + pack.lessons.length + " lessons, " + pack.commands.length + " command guides, " + pack.debugging.length + " debugging playbooks.");
