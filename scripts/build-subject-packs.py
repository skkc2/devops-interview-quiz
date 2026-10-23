"""Compile authored quiz and learning sources; runtime is static JSON only."""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'content' / 'library'
LEVELS = ['easy', 'medium', 'mediumHard', 'hard']
NAMES = {'kubernetes':'Kubernetes','linux':'Linux','networking':'Networking','sre':'SRE & incident response','systems':'Systems administration','aws':'AWS','terraform':'Terraform','docker':'Docker','ansible':'Ansible','git':'Git & CI/CD','observability':'Observability'}
REFS = {'kubernetes':'https://kubernetes.io/docs/concepts/','linux':'https://man7.org/linux/man-pages/','networking':'https://www.rfc-editor.org/rfc/rfc9293.html','sre':'https://sre.google/workbook/table-of-contents/','systems':'https://www.freedesktop.org/software/systemd/man/latest/','aws':'https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html','terraform':'https://developer.hashicorp.com/terraform/language','docker':'https://docs.docker.com/engine/','ansible':'https://docs.ansible.com/ansible/latest/playbook_guide/index.html','git':'https://git-scm.com/docs','observability':'https://opentelemetry.io/docs/concepts/observability-primer/'}
REFERENCES = json.loads((ROOT/'content/references.json').read_text())
COMMAND_REFS = {'kubectl':'https://kubernetes.io/docs/reference/kubectl/quick-reference/','docker':'https://docs.docker.com/reference/cli/docker/','terraform':'https://developer.hashicorp.com/terraform/cli/commands','aws':'https://docs.aws.amazon.com/cli/latest/reference/','ansible':'https://docs.ansible.com/ansible/latest/command_guide/command_line_tools.html','git':'https://git-scm.com/docs','curl':'https://curl.se/docs/manpage.html','openssl':'https://docs.openssl.org/master/man1/openssl-s_client/','promtool':'https://prometheus.io/docs/prometheus/latest/command-line/promtool/','systemctl':'https://www.freedesktop.org/software/systemd/man/latest/systemctl.html','journalctl':'https://www.freedesktop.org/software/systemd/man/latest/journalctl.html','timedatectl':'https://www.freedesktop.org/software/systemd/man/latest/timedatectl.html','sshd':'https://www.openssh.com/manual.html','logrotate':'https://github.com/logrotate/logrotate','visudo':'https://www.sudo.ws/docs/man/visudo.man/'}

def write_json(path, value):
    content = json.dumps(value, indent=2) + '\n'
    if '--check' in sys.argv:
        assert path.read_text() == content, f'{path.name} differs from authored source; rebuild packs'
    else:
        path.write_text(content)

def rows(topic, kind, fields, count):
    result = [line.split('|') for line in (SOURCE/f'{topic}.{kind}').read_text().splitlines() if line.strip()]
    assert len(result) == count, (topic, kind, len(result))
    assert all(len(row) == fields for row in result), (topic, kind, 'field count')
    return result

def refs(topic, title, command=''):
    url = REFERENCES.get(topic, {}).get(title, REFS[topic])
    if command:
        if '(' in command.split(' ')[0] or command.startswith('up{'):
            url = 'https://prometheus.io/docs/prometheus/latest/querying/functions/'
        else:
            first = command.split(' ')[0]
            key = 'ansible' if first.startswith('ansible') else first
            url = COMMAND_REFS.get(key, 'https://man7.org/linux/man-pages/')
    return [{'title':title+' — primary documentation','url':url}]

for topic, name in NAMES.items():
    concepts = rows(topic, 'concepts', 4, 30)
    interview_rows = rows(topic, 'interviews', 2, 30)
    lessons = []
    for i, (title, definition, mechanism, command) in enumerate(concepts):
        lessons.append({'id':f'{topic}-lesson-{i+1:02}','topic':topic,'title':title,'summary':definition,'sections':[{'heading':'What it is','body':definition},{'heading':'How it works','body':mechanism}],'command':command,'takeaway':mechanism,'references':refs(topic,title) + (refs(topic,'Related command',command) if command else [])})
    commands = []
    for i, (title, command, definition, purpose, interpretation, output, context) in enumerate(rows(topic,'commands',7,12)):
        query = topic in ('sre','observability') and (command.startswith('up{') or '(' in command.split(' ')[0])
        commands.append({'id':f'{topic}-command-{i+1:02}','topic':topic,'title':title,'command':command,'kind':'PromQL query' if query else 'Shell command','definition':definition,'purpose':purpose,'environment':context,'expectedOutput':output,'interpretation':interpretation,'safety':context,'references':refs(topic,title,command)})
    scenarios = []
    for i, (title, symptom, command, diagnosis, fix, verification) in enumerate(rows(topic,'scenarios',6,10)):
        scenarios.append({'id':f'{topic}-scenario-guide-{i+1:02}','topic':topic,'title':title,'symptom':symptom,'steps':[{'action':'Inspect and diagnose','command':command,'evidence':diagnosis},{'action':'Fix the evidenced cause','evidence':fix},{'action':'Verify recovery','evidence':verification}],'references':refs(topic,title) + (refs(topic,'Diagnostic tool',command) if command else [])})
    write_json(ROOT/'data'/f'{topic}-learning.json',{'subject':topic,'lessons':lessons,'commands':commands,'debugging':scenarios})
    if topic == 'kubernetes':
        pack = json.loads((ROOT/'content/kubernetes-bank.json').read_text())
        # Four established prompts retain both their wording and stable saved IDs.
        for i, (prompt, followup) in enumerate(interview_rows):
            if i in (1, 8, 27, 28):
                continue  # covered by the four established real-incident prompts
            lesson = lessons[i]
            title, definition, mechanism, _ = concepts[i]
            pack['questions'].append({'id':f'k8s-library-interview-{i+1:02}','topic':topic,'level':LEVELS[min(i//8,3)],'type':'interview','title':title+' interview','question':prompt,'options':[],'correct':[],'objective':'Explain '+title.lower()+' and defend operational trade-offs.','explanation':definition+' '+mechanism,'takeaway':mechanism,'sampleAnswer':definition+' '+mechanism,'answerChecklist':[definition,mechanism,'Address the follow-up using concrete evidence and the relevant failure boundary.'],'followUps':[followup],'references':lesson['references'],'tags':[topic,'interview']})
        pack['description']='120 scored questions and 30 self-reviewed interview prompts across core Kubernetes operations.'
    else:
        competencies = [l.split('|') for l in (ROOT/'content'/f'{topic}.txt').read_text().splitlines() if l.strip() and not l.startswith('#')]
        assert len(competencies) == 30
        questions = []
        for i, row in enumerate(competencies):
            assert len(row) == 10
            title,prompt,fact,principle,false1,false2,scenario,action,bad,probe = row
            assert title == concepts[i][0], (topic,title,'concept alignment')
            level = LEVELS[min(i//8,3)]
            explanation = f'{prompt} {fact}. {principle}. In this situation: {action}. The alternative “{bad}” does not address the stated evidence or constraint.'
            base = {'level':level,'topic':topic,'objective':f'Explain {title.lower()} and apply it to an operational decision.','references':refs(topic,title),'tags':[topic,title.lower().replace(' ','-')],'takeaway':principle+'.','explanation':explanation}
            def add(suffix,kind,question,opts,correct,**extra):
                offset = (i+len(questions))%4 if opts else 0
                opts = opts[offset:]+opts[:offset]
                correct = sorted((c-offset)%4 for c in correct)
                questions.append(dict(base,id=f'{topic}-{i+1:02}-{suffix}',title=title+' · '+suffix,type=kind,question=question,options=opts,correct=correct,**extra))
            add('concept','concept',prompt,[fact,false1,false2,bad],[0])
            add('scenario','scenario',scenario+' What is the best next step?',[action,bad,false1,false2],[0])
            add('principles','multi-select',f'{prompt} Considering this context and its operational implications, which TWO statements are accurate?',[fact,principle,false1,false2],[0,1])
            definition, mechanism = concepts[i][1:3]
            question, followup = interview_rows[i]
            add('interview','interview',question,[],[],sampleAnswer=definition+' '+mechanism+' For example: '+scenario+' '+action+'.',answerChecklist=[definition,mechanism,action+'.'],followUps=[followup])
        pack = {'schemaVersion':1,'subject':name,'levels':LEVELS,'description':'30 competency sets: 90 scored questions and 30 self-reviewed interview prompts. Related scored questions reinforce a competency from different angles.','questions':questions}
    assert len([q for q in pack['questions'] if q['type']=='interview']) == 30
    write_json(ROOT/'data'/f'{topic}.json',pack)
manifest = {'schemaVersion':1,'subjects':[{'id':t,'label':n,'questions':f'data/{t}.json','learning':f'data/{t}-learning.json'} for t,n in NAMES.items()]}
write_json(ROOT/'data/subjects.json',manifest)
