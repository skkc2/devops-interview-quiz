const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = file => JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));
const subjects = read('data/subjects.json').subjects;
const commandCounts={kubernetes:40,linux:40,networking:40,sre:24,systems:30,aws:30,terraform:30,docker:30,ansible:30,git:30,observability:24};
let commands=0, scenarios=0;
for(const subject of subjects){
  const library=read(subject.learning), bank=read(subject.questions);
  assert.equal(library.lessons.length,30,subject.id+' concepts');
  assert.equal(library.commands.length,commandCounts[subject.id],subject.id+' commands');
  assert.equal(library.debugging.length,10,subject.id+' scenarios');
  assert.equal(bank.questions.filter(q=>q.type==='interview').length,30,subject.id+' interviews');
  for(const lesson of library.lessons){
    assert.deepEqual(lesson.sections.map(s=>s.heading),['What it is','How it works']);
    assert.ok(lesson.sections[0].body.length>30,lesson.id+' definition');
    assert.ok(lesson.sections[1].body.length>100,lesson.id+' mechanism');
    assert.equal(lesson.summary,lesson.sections[0].body);
  }
  for(const command of library.commands){
    commands++;
    for(const field of ['command','definition','purpose','interpretation','expectedOutput','environment']){
      assert.ok(command[field]?.trim().length>(['expectedOutput','command'].includes(field)?0:8),command.id+': '+field);
    }
    assert.ok(['PromQL query','Shell command'].includes(command.kind));
    assert.ok(command.references.length);
  }
  for(const scenario of library.debugging){
    scenarios++;
    assert.ok(scenario.symptom.length>30,scenario.id);
    assert.deepEqual(scenario.steps.map(s=>s.action),['Inspect and diagnose','Fix the evidenced cause','Verify recovery']);
    assert.ok(scenario.steps.every(s=>s.evidence.length>65),scenario.id+' requires substantive diagnosis/fix/verification');
  }
  console.log(subject.label+': 30 concepts, '+library.commands.length+' commands, 10 scenarios, 30 interview prompts');
}
assert.equal(commands,348);assert.equal(scenarios,110);
console.log('Learning library validated for all eleven subjects.');
