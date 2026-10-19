const assert = require("node:assert/strict");
const fs = require("node:fs");
const legacy = require("../questions.js");
const curated = JSON.parse(fs.readFileSync(require("node:path").join(__dirname, "../data/kubernetes.json"), "utf8"));

const levels = ["easy", "medium", "mediumHard", "hard"];
const types = ["concept", "command", "scenario", "multi-select", "trade-off", "interview"];
assert.deepEqual(curated.levels, levels, "The curated track must declare all four levels.");
assert.ok(Array.isArray(curated.questions) && curated.questions.length >= 24, "The curated track should have at least 24 questions.");

const ids = new Set();
const prompts = new Set();
const counts = Object.fromEntries(levels.map(level => [level, 0]));
const typeCounts = Object.fromEntries(types.map(type => [type, 0]));

for (const [index, q] of curated.questions.entries()) {
  const label = "kubernetes[" + index + "] " + (q.id || "(no id)");
  assert.ok(q.id && !ids.has(q.id), label + " must have a unique id.");
  ids.add(q.id);
  assert.ok(levels.includes(q.level), label + " has an unknown level.");
  assert.equal(q.topic, "kubernetes", label + " must belong to the Kubernetes track.");
  assert.ok(types.includes(q.type), label + " has an unknown question type.");
  assert.ok(typeof q.question === "string" && q.question.trim().length > 20, label + " needs meaningful question text.");
  assert.ok(typeof q.objective === "string" && q.objective.trim().length > 10, label + " needs a learning objective.");
  assert.ok(typeof q.explanation === "string" && q.explanation.trim().length > 30, label + " needs a substantive explanation.");
  assert.ok(typeof q.takeaway === "string" && q.takeaway.trim().length > 15, label + " needs a memorable takeaway.");
  assert.ok(Array.isArray(q.options), label + " options must be an array.");
  assert.ok(Array.isArray(q.correct), label + " correct must be an array of zero-based option indices.");
  assert.ok(Array.isArray(q.references) && q.references.length > 0, label + " needs at least one reference.");
  for (const r of q.references) {
    assert.ok(typeof r.title === "string" && r.title.length > 0, label + " reference needs a title.");
    assert.ok(typeof r.url === "string" && r.url.startsWith("https://kubernetes.io/docs/"), label + " must link to official Kubernetes documentation.");
  }
  if (q.type === "interview") {
    assert.equal(q.options.length, 0, label + " interview prompts should not have fake multiple-choice options.");
    assert.equal(q.correct.length, 0, label + " interview prompts should not be auto-graded.");
    assert.ok(typeof q.sampleAnswer === "string" && q.sampleAnswer.length > 80, label + " needs a useful example answer.");
    assert.ok(Array.isArray(q.answerChecklist) && q.answerChecklist.length >= 3, label + " needs an answer checklist.");
    assert.ok(Array.isArray(q.followUps) && q.followUps.length >= 1, label + " should include a follow-up prompt.");
  } else {
    assert.equal(q.options.length, 4, label + " must have four answer options.");
    assert.equal(new Set(q.options).size, q.options.length, label + " answer options must be distinct.");
    assert.ok(q.correct.length >= 1, label + " must have at least one correct answer.");
    for (const index of q.correct) assert.ok(Number.isInteger(index) && index >= 0 && index < q.options.length, label + " has an invalid correct answer index.");
    assert.equal(new Set(q.correct).size, q.correct.length, label + " correct answer indices must be unique.");
    if (q.type === "multi-select") assert.ok(q.correct.length >= 2, label + " should have more than one correct choice.");
    else assert.equal(q.correct.length, 1, label + " should have exactly one correct choice.");
  }
  const normalized = q.question.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  assert.ok(!prompts.has(normalized), label + " duplicates another question prompt.");
  prompts.add(normalized);
  counts[q.level]++;
  typeCounts[q.type]++;
}
for (const level of levels) assert.ok(counts[level] >= 6, level + " needs at least six curated questions.");
for (const type of types) assert.ok(typeCounts[type] >= 1, "Missing curated question type: " + type);

let legacyTotal = 0;
for (const level of levels) {
  const groups = legacy[level];
  assert.ok(groups && Object.keys(groups).length > 0, "Legacy " + level + " question groups are missing.");
  for (const [topic, questions] of Object.entries(groups)) {
    assert.ok(Array.isArray(questions), level + "/" + topic + " must be an array.");
    for (const [index, q] of questions.entries()) {
      assert.ok(typeof q.question === "string" && q.question.trim().length > 10, level + "/" + topic + "[" + index + "] needs question text.");
      assert.ok(Array.isArray(q.options) && q.options.length === 4, level + "/" + topic + "[" + index + "] must have four options.");
      assert.ok(Number.isInteger(q.correct) && q.correct >= 0 && q.correct < q.options.length, level + "/" + topic + "[" + index + "] has an invalid correct answer index.");
      assert.equal(new Set(q.options).size, q.options.length, level + "/" + topic + "[" + index + "] has duplicate answer options.");
      legacyTotal++;
    }
  }
}
assert.ok(legacyTotal >= 210, "Expected at least 210 legacy questions.");
console.log("Kubernetes track: " + curated.questions.length + " curated questions across " + levels.length + " levels.");
console.log("Question types: " + Object.entries(typeCounts).map(([type, count]) => type + "=" + count).join(", "));
console.log("Legacy bank: " + legacyTotal + " questions validated.");
