const assert = require("node:assert/strict");
const bank = require("../questions.js");

const requiredLevels = ["easy", "medium", "mediumHard", "hard"];
assert.deepEqual(Object.keys(bank), requiredLevels, "The bank must expose all four learning levels.");

let total = 0;
for (const level of requiredLevels) {
  const groups = bank[level];
  assert.ok(groups && Object.keys(groups).length > 0, level + " must have question groups.");
  let levelCount = 0;
  for (const [topic, questions] of Object.entries(groups)) {
    assert.ok(Array.isArray(questions), level + "/" + topic + " must be an array.");
    assert.ok(questions.length > 0, level + "/" + topic + " must not be empty.");
    for (const [index, q] of questions.entries()) {
      const label = level + "/" + topic + "[" + index + "]";
      assert.equal(typeof q.question, "string", label + " needs question text.");
      assert.ok(q.question.trim().length > 10, label + " question text is too short.");
      assert.ok(Array.isArray(q.options) && q.options.length === 4, label + " must have four options.");
      assert.ok(Number.isInteger(q.correct) && q.correct >= 0 && q.correct < q.options.length, label + " has an invalid correct answer index.");
      assert.equal(new Set(q.options).size, q.options.length, label + " must have unique options.");
      if (q.explanation !== undefined) assert.equal(typeof q.explanation, "string", label + " explanation must be text.");
      levelCount++;
    }
  }
  total += levelCount;
  console.log(level + ": " + levelCount + " questions across " + Object.keys(groups).length + " topics");
}
assert.ok(total >= 250, "Expected the combined legacy and new bank to include at least 250 questions.");
console.log("Validated " + total + " questions.");
