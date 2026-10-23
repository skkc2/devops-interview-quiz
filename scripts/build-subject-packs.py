import json
import sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def write_json(path, value):
    content=json.dumps(value,indent=2)+'\n'
    if '--check' in sys.argv:
        assert path.read_text()==content, f'{path.name} differs from authored source; rebuild packs'
    else:
        path.write_text(content)

LEVELS=['easy','medium','mediumHard','hard']
NAMES={'linux':'Linux','networking':'Networking','sre':'SRE & incident response','systems':'Systems administration','aws':'AWS','terraform':'Terraform','docker':'Docker','ansible':'Ansible','git':'Git & CI/CD','observability':'Observability'}
REFS={'linux':'https://www.gnu.org/software/coreutils/manual/coreutils.html','networking':'https://www.rfc-editor.org/rfc/rfc9293.html','sre':'https://sre.google/workbook/table-of-contents/','systems':'https://www.freedesktop.org/software/systemd/man/latest/','aws':'https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html','terraform':'https://developer.hashicorp.com/terraform/language','docker':'https://docs.docker.com/engine/','ansible':'https://docs.ansible.com/ansible/latest/playbook_guide/index.html','git':'https://git-scm.com/docs','observability':'https://opentelemetry.io/docs/concepts/observability-primer/'}
REFERENCES=json.loads((ROOT/'content'/'references.json').read_text())
# Each authored competency has a recall question, an operational scenario,
# two sound principles, two misconceptions, and a specific interview probe.
# Build output is deterministic; the browser reads JSON only.
for topic,name in NAMES.items():
    rows=[l.split('|') for l in (ROOT/'content'/f'{topic}.txt').read_text().splitlines() if l.strip() and not l.startswith('#')]
    assert len(rows)==30,(topic,len(rows))
    questions=[]
    lessons=[]
    for i,row in enumerate(rows):
        assert len(row)==10,(topic,i,len(row))
        title,prompt,fact,principle,false1,false2,scenario,action,bad,probe=row
        level=LEVELS[min(i//8,3)]
        url=REFERENCES.get(topic,{}).get(title,REFS[topic])
        refs=[{'title':title+' — primary reference','url':url}]
        explanation=f'{fact}. {principle}. In the scenario, {action[0].lower()+action[1:]}. The alternative ‘{bad}’ does not address the stated evidence or constraint.'
        base={'level':level,'topic':topic,'objective':f'Explain {title.lower()} and apply it to an operational decision.','references':refs,'tags':[topic,title.lower().replace(' ','-')],'takeaway':principle+'.','explanation':explanation}
        def add(suffix,kind,question,opts,correct,**extra):
            # Rotate answer placement, avoiding an all-first-answer bank.
            offset=(i+len(questions))%4 if opts else 0
            opts=opts[offset:]+opts[:offset]
            correct=sorted((c-offset)%4 for c in correct)
            questions.append(dict(base,id=f'{topic}-{i+1:02}-{suffix}',title=title+' · '+suffix, type=kind,question=question,options=opts,correct=correct,**extra))
        add('concept','concept',prompt,[fact,false1,false2,bad],[0])
        add('scenario','scenario',scenario+' What is the best next step?', [action,bad,false1,false2],[0])
        add('principles','multi-select',f'{prompt} Considering this context and its operational implications, which TWO statements are accurate?',[fact,principle,false1,false2],[0,1])
        answer=f'{principle}. Consider this situation: {scenario} A practical response is: {action}. The relevant concept is: {prompt} {fact}. I would record the initial evidence, make the smallest scoped change needed, and compare the same measurements afterward. I would not assume that {false1[0].lower()+false1[1:]}.'
        add('interview','interview',probe,[],[],sampleAnswer=answer,answerChecklist=[fact,principle,action,'Explain how you would verify the outcome and stop if it worsens.'],followUps=[scenario+' Explain the evidence that would change your decision.'])
        lessons.append({'id':f'{topic}-lesson-{i+1:02}','topic':topic,'title':title,'summary':prompt+' '+fact+'.','sections':[{'heading':'How it works','body':principle+'.'},{'heading':'Apply it','body':scenario+' '+action+'.'},{'heading':'Misconception to challenge','body':false1+'. This is not a sound assumption; '+fact[0].lower()+fact[1:]+'.'}],'takeaway':principle+'.','references':refs})
    pack={'schemaVersion':1,'subject':name,'levels':LEVELS,'description':'30 competency sets: 90 scored questions and 30 self-reviewed interview prompts. Related questions intentionally reinforce a competency from different angles.','questions':questions}
    write_json(ROOT/'data'/f'{topic}.json',pack)
    write_json(ROOT/'data'/f'{topic}-learning.json',{'subject':topic,'lessons':lessons,'commands':[],'debugging':[]})
manifest={'schemaVersion':1,'subjects':[{'id':'kubernetes','label':'Kubernetes','questions':'data/kubernetes.json','learning':'data/kubernetes-learning.json'}]+[{'id':t,'label':n,'questions':f'data/{t}.json','learning':f'data/{t}-learning.json'} for t,n in NAMES.items()]}
write_json(ROOT/'data'/'subjects.json',manifest)
