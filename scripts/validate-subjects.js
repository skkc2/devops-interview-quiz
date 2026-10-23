/* Validate the complete catalog, not just the original Kubernetes pack. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const manifest = read('data/subjects.json');
const expected = ['kubernetes','linux','networking','sre','systems','aws','terraform','docker','ansible','git','observability'];
assert.deepEqual(manifest.subjects.map(s => s.id).sort(), expected.sort());
assert.equal(manifest.schemaVersion, 1);
const ids = new Set(), prompts = new Set();
const allowed = new Set(['kubernetes.io','man7.org','www.gnu.org','strace.io','www.kernel.org','www.rfc-editor.org','sre.google','docs.aws.amazon.com','developer.hashicorp.com','docs.docker.com','docs.ansible.com','git-scm.com','docs.github.com','opentelemetry.io','prometheus.io','www.freedesktop.org','www.openssh.com','www.sudo.ws','www.debian.org','curl.se','docs.openssl.org','github.com']);
function refs(item) {
  assert.ok(item.references?.length, item.id + ' requires references');
  for (const ref of item.references) {
    const url = new URL(ref.url);
    assert.equal(url.protocol, 'https:');
    assert.ok(allowed.has(url.hostname), item.id + ': unapproved reference host ' + url.hostname);
    assert.ok(ref.title?.trim());
  }
}
function id(item) {
  assert.ok(typeof item.id === 'string' && !ids.has(item.id), 'duplicate/missing ID: ' + item.id);
  ids.add(item.id);
}
let graded = 0, interviews = 0, lessons = 0;
for (const subject of manifest.subjects) {
  assert.match(subject.questions, /^data\/[a-z-]+\.json$/);
  assert.match(subject.learning, /^data\/[a-z-]+\.json$/);
  const pack = read(subject.questions), library = read(subject.learning);
  const levels = ['easy','medium','mediumHard','hard'];
  assert.deepEqual(pack.levels, levels);
  assert.equal(pack.schemaVersion, 1);
  assert.equal(pack.questions.length, subject.id === 'kubernetes' ? 150 : 120, subject.id);
  assert.equal(library.subject, subject.id);
  for (const q of pack.questions) {
    id(q); refs(q);
    assert.equal(q.topic, subject.id);
    assert.ok(levels.includes(q.level));
    assert.ok(['concept','command','scenario','multi-select','trade-off','interview'].includes(q.type));
    for (const field of ['title','question','objective','explanation','takeaway']) assert.ok(typeof q[field] === 'string' && q[field].trim().length > 10, q.id + ': ' + field);
    const normalized = q.question.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
    // Identical prompts within a subject are disallowed; a similar cross-subject
    // competency can be intentional (e.g. network versus SRE retry behavior).
    const key = subject.id + ':' + normalized;
    assert.ok(!prompts.has(key), 'Duplicate prompt: ' + key); prompts.add(key);
    assert.ok(Array.isArray(q.options) && Array.isArray(q.correct));
    if (q.type === 'interview') {
      interviews++;
      assert.equal(q.options.length, 0); assert.equal(q.correct.length, 0);
      assert.ok(q.sampleAnswer?.length > 80);
      assert.ok(q.answerChecklist?.length >= 3 && q.followUps?.length >= 1);
    } else {
      graded++;
      assert.equal(q.options.length, 4);
      assert.equal(new Set(q.options.map(x=>x.trim().toLowerCase())).size, 4, q.id);
      assert.ok(q.options.every(x=>typeof x==='string'&&x.trim()));
      assert.equal(new Set(q.correct).size, q.correct.length);
      assert.ok(q.correct.every(n=>Number.isInteger(n)&&n>=0&&n<4));
      if(q.type==='multi-select') assert.ok(q.correct.length>=2 && q.correct.length<4,q.id);
      else assert.equal(q.correct.length,1,q.id);
    }
  }
  for (const level of levels) {
    const rows=pack.questions.filter(q=>q.level===level);
    assert.ok(rows.some(q=>q.type==='interview'), subject.id + '/' + level + ' interview coverage');
    assert.ok(rows.filter(q=>q.type!=='interview').length>=18, subject.id + '/' + level + ' scored coverage');
  }
  if (subject.id!=='kubernetes') {
    assert.equal(pack.questions.filter(q=>q.type==='interview').length,30);
    for (const type of ['concept','scenario','multi-select']) assert.equal(pack.questions.filter(q=>q.type===type).length,30);
    assert.equal(library.lessons.length,30);
    for(const concept of pack.questions.filter(q=>q.type==='concept')) {
      const prefix=concept.id.replace(/-concept$/, '');
      const check=pack.questions.find(q=>q.id===prefix+'-principles');
      assert.ok(check.question.startsWith(concept.question), prefix+': multi-select must retain the factual context');

    }
  }
  for (const key of ['lessons','commands','debugging']) {
    assert.ok(Array.isArray(library[key]));
    for(const item of library[key]) { id(item);refs(item); assert.ok(item.title); if(item.topic && subject.id!=='kubernetes')assert.equal(item.topic,subject.id); }
  }
  for(const lesson of library.lessons) {
    lessons++;
    assert.ok(lesson.summary && lesson.takeaway && lesson.sections.length>=2);
    assert.ok(lesson.sections.every(s=>s.heading&&s.body?.length>20));
  }
  console.log(subject.label + ': ' + pack.questions.length + ' items; ' + library.lessons.length + ' lessons');
}
assert.equal(graded,1020); assert.equal(interviews,330); assert.equal(lessons,330);
const original=read('content/kubernetes-bank.json');
const current=read('data/kubernetes.json');
for(const q of original.questions) assert.deepEqual(current.questions.find(x=>x.id===q.id),q,'Existing Kubernetes item changed');
console.log(`Catalog validated: ${graded} scored + ${interviews} interview prompts, ${lessons} lessons.`);
